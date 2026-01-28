/**
 * Web Worker Client
 * 
 * Provides a clean API for communicating with the calculation Web Worker.
 * Handles message passing, promise-based results, and progress callbacks.
 * Validates: Requirements 21.3, 4.8
 */

import type {
  WorkerRequest,
  WorkerResponse,
  EvaluatePayload,
  MatrixPayload,
  GraphPayload,
  BatchPayload,
  EvaluateResult,
  MatrixResult,
  GraphResult,
  BatchResult,
  ProgressPayload,
  Matrix,
  AngleMode
} from '../types';

// Type for progress callback
export type ProgressCallback = (progress: ProgressPayload) => void;

// Pending request tracking
interface PendingRequest {
  resolve: (value: unknown) => void;
  reject: (error: Error) => void;
  onProgress?: ProgressCallback | undefined;
}

// Worker factory type for dependency injection
export type WorkerFactory = () => Worker;

/**
 * Worker Client class for managing Web Worker communication
 */
class WorkerClient {
  private worker: Worker | null = null;
  private pendingRequests: Map<string, PendingRequest> = new Map();
  private requestIdCounter = 0;
  private isInitialized = false;
  private workerFactory: WorkerFactory | null = null;

  /**
   * Set a custom worker factory (for testing)
   */
  setWorkerFactory(factory: WorkerFactory): void {
    this.workerFactory = factory;
  }

  /**
   * Initialize the worker
   */
  initialize(): void {
    if (this.isInitialized) return;

    try {
      // Use custom factory if provided, otherwise use Vite's worker import syntax
      if (this.workerFactory) {
        this.worker = this.workerFactory();
      } else {
        this.worker = new Worker(new URL('./worker.ts', import.meta.url), { type: 'module' });
      }
      
      this.worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
        this.handleMessage(event.data);
      };

      this.worker.onerror = (error) => {
        console.error('Worker error:', error);
        // Reject all pending requests
        for (const [id, request] of this.pendingRequests) {
          request.reject(new Error('Worker error'));
          this.pendingRequests.delete(id);
        }
      };

      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize worker:', error);
      throw error;
    }
  }

  /**
   * Handle incoming messages from the worker
   */
  private handleMessage(response: WorkerResponse): void {
    const { id, type, payload } = response;
    const pending = this.pendingRequests.get(id);

    if (!pending) {
      console.warn(`Received response for unknown request: ${id}`);
      return;
    }

    switch (type) {
      case 'result':
        pending.resolve(payload);
        this.pendingRequests.delete(id);
        break;
      case 'error':
        pending.reject(new Error(payload as string));
        this.pendingRequests.delete(id);
        break;
      case 'progress':
        if (pending.onProgress) {
          pending.onProgress(payload as ProgressPayload);
        }
        break;
    }
  }

  /**
   * Generate a unique request ID
   */
  private generateId(): string {
    return `req_${++this.requestIdCounter}_${Date.now()}`;
  }

  /**
   * Send a request to the worker and return a promise
   */
  private sendRequest<T>(
    type: WorkerRequest['type'],
    payload: unknown,
    onProgress?: ProgressCallback
  ): Promise<T> {
    if (!this.worker) {
      this.initialize();
    }

    if (!this.worker) {
      return Promise.reject(new Error('Worker not available'));
    }

    return new Promise((resolve, reject) => {
      const id = this.generateId();
      
      this.pendingRequests.set(id, {
        resolve: resolve as (value: unknown) => void,
        reject,
        onProgress
      });

      const request: WorkerRequest = { id, type, payload };
      this.worker!.postMessage(request);
    });
  }

  /**
   * Evaluate an expression in the worker
   */
  evaluate(
    expression: string,
    options: {
      precision?: number;
      angleMode?: AngleMode;
      usePrecisionMode?: boolean;
      variables?: Record<string, number>;
    } = {},
    onProgress?: ProgressCallback
  ): Promise<EvaluateResult> {
    const payload: EvaluatePayload = {
      expression,
      precision: options.precision ?? 15,
      angleMode: options.angleMode ?? 'radians',
      usePrecisionMode: options.usePrecisionMode ?? false,
    };
    
    if (options.variables) {
      payload.variables = options.variables;
    }

    return this.sendRequest<EvaluateResult>('evaluate', payload, onProgress);
  }

  /**
   * Perform matrix operations in the worker
   */
  matrixOperation(
    operation: MatrixPayload['operation'],
    matrices: Matrix[],
    constants?: number[],
    onProgress?: ProgressCallback
  ): Promise<MatrixResult> {
    const payload: MatrixPayload = {
      operation,
      matrices,
    };
    
    if (constants) {
      payload.constants = constants;
    }

    return this.sendRequest<MatrixResult>('matrix', payload, onProgress);
  }

  /**
   * Generate graph data in the worker
   */
  generateGraphData(
    expression: string,
    xMin: number,
    xMax: number,
    numPoints: number = 500,
    variables?: Record<string, number>,
    onProgress?: ProgressCallback
  ): Promise<GraphResult> {
    const payload: GraphPayload = {
      expression,
      xMin,
      xMax,
      numPoints,
    };
    
    if (variables) {
      payload.variables = variables;
    }

    return this.sendRequest<GraphResult>('graph', payload, onProgress);
  }

  /**
   * Evaluate multiple expressions in batch
   */
  batchEvaluate(
    expressions: string[],
    options: {
      precision?: number;
      angleMode?: AngleMode;
      usePrecisionMode?: boolean;
    } = {},
    onProgress?: ProgressCallback
  ): Promise<BatchResult> {
    const payload: BatchPayload = {
      expressions,
      precision: options.precision ?? 15,
      angleMode: options.angleMode ?? 'radians',
      usePrecisionMode: options.usePrecisionMode ?? false
    };

    return this.sendRequest<BatchResult>('batch', payload, onProgress);
  }

  /**
   * Terminate the worker
   */
  terminate(): void {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
      this.isInitialized = false;
      
      // Reject all pending requests
      for (const [, request] of this.pendingRequests) {
        request.reject(new Error('Worker terminated'));
      }
      this.pendingRequests.clear();
    }
  }

  /**
   * Check if the worker is available
   */
  isAvailable(): boolean {
    return typeof Worker !== 'undefined';
  }
}

// Export a singleton instance
export const workerClient = new WorkerClient();

// Export the class for testing
export { WorkerClient };
