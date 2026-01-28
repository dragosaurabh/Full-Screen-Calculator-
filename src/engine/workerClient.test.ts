/**
 * Worker Client Tests
 * 
 * Tests for the WorkerClient class that manages Web Worker communication.
 * Uses dependency injection to provide a mock worker for testing.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { WorkerClient } from './workerClient';
import type { WorkerResponse, WorkerRequest, Matrix } from '../types';

// Mock Worker class that simulates Web Worker behavior
class MockWorker {
  onmessage: ((event: MessageEvent) => void) | null = null;
  onerror: ((error: ErrorEvent) => void) | null = null;
  
  private responseHandler: ((request: WorkerRequest) => void) | null = null;
  private terminated = false;
  
  postMessage(data: WorkerRequest): void {
    // Simulate async response
    if (this.responseHandler && !this.terminated) {
      setTimeout(() => {
        if (this.responseHandler && !this.terminated) {
          this.responseHandler(data);
        }
      }, 0);
    }
  }
  
  terminate(): void {
    this.terminated = true;
    this.onmessage = null;
    this.onerror = null;
    this.responseHandler = null;
  }
  
  // Test helper to set up response simulation
  setResponseHandler(handler: (request: WorkerRequest) => void): void {
    this.responseHandler = handler;
  }
  
  // Test helper to simulate a response
  simulateResponse(response: WorkerResponse): void {
    if (this.onmessage && !this.terminated) {
      this.onmessage(new MessageEvent('message', { data: response }));
    }
  }
  
  // Test helper to simulate an error
  simulateError(error: Error): void {
    if (this.onerror && !this.terminated) {
      const errorEvent = new ErrorEvent('error', { error, message: error.message });
      this.onerror(errorEvent);
    }
  }
}

describe('WorkerClient', () => {
  let mockWorker: MockWorker;
  let client: WorkerClient;
  
  beforeEach(() => {
    mockWorker = new MockWorker();
    client = new WorkerClient();
    
    // Inject the mock worker factory
    client.setWorkerFactory(() => mockWorker as unknown as Worker);
  });
  
  afterEach(() => {
    client.terminate();
  });
  
  describe('initialization', () => {
    it('should create a worker on first request', async () => {
      // Set up mock to respond immediately
      mockWorker.setResponseHandler((request: WorkerRequest) => {
        mockWorker.simulateResponse({
          id: request.id,
          type: 'result',
          payload: { value: 4, formatted: '4' }
        });
      });
      
      const result = await client.evaluate('2 + 2');
      
      expect(result.value).toBe(4);
    });
    
    it('should reuse the same worker for multiple requests', async () => {
      let requestCount = 0;
      
      mockWorker.setResponseHandler((request: WorkerRequest) => {
        requestCount++;
        mockWorker.simulateResponse({
          id: request.id,
          type: 'result',
          payload: { value: requestCount * 2, formatted: String(requestCount * 2) }
        });
      });
      
      const result1 = await client.evaluate('2 + 2');
      const result2 = await client.evaluate('3 + 3');
      
      expect(result1.value).toBe(2);
      expect(result2.value).toBe(4);
      expect(requestCount).toBe(2);
    });
  });
  
  describe('evaluate', () => {
    it('should send evaluate request with correct payload', async () => {
      let capturedPayload: unknown;
      
      mockWorker.setResponseHandler((request: WorkerRequest) => {
        capturedPayload = request.payload;
        mockWorker.simulateResponse({
          id: request.id,
          type: 'result',
          payload: { value: 10, formatted: '10' }
        });
      });
      
      await client.evaluate('5 * 2', {
        precision: 20,
        angleMode: 'degrees',
        usePrecisionMode: true,
        variables: { x: 5 }
      });
      
      expect(capturedPayload).toEqual({
        expression: '5 * 2',
        precision: 20,
        angleMode: 'degrees',
        usePrecisionMode: true,
        variables: { x: 5 }
      });
    });
    
    it('should use default options when not provided', async () => {
      let capturedPayload: unknown;
      
      mockWorker.setResponseHandler((request: WorkerRequest) => {
        capturedPayload = request.payload;
        mockWorker.simulateResponse({
          id: request.id,
          type: 'result',
          payload: { value: 4, formatted: '4' }
        });
      });
      
      await client.evaluate('2 + 2');
      
      expect(capturedPayload).toEqual({
        expression: '2 + 2',
        precision: 15,
        angleMode: 'radians',
        usePrecisionMode: false
      });
    });
  });
  
  describe('matrixOperation', () => {
    it('should send matrix operation request', async () => {
      let capturedPayload: unknown;
      
      const matrixA: Matrix = { rows: 2, cols: 2, data: [[1, 2], [3, 4]] };
      const matrixB: Matrix = { rows: 2, cols: 2, data: [[5, 6], [7, 8]] };
      
      mockWorker.setResponseHandler((request: WorkerRequest) => {
        capturedPayload = request.payload;
        mockWorker.simulateResponse({
          id: request.id,
          type: 'result',
          payload: { result: { rows: 2, cols: 2, data: [[19, 22], [43, 50]] }, type: 'matrix' }
        });
      });
      
      await client.matrixOperation('multiply', [matrixA, matrixB]);
      
      expect(capturedPayload).toEqual({
        operation: 'multiply',
        matrices: [matrixA, matrixB]
      });
    });
    
    it('should include constants for solve operation', async () => {
      let capturedPayload: unknown;
      
      const coefficients: Matrix = { rows: 2, cols: 2, data: [[2, 1], [1, 3]] };
      
      mockWorker.setResponseHandler((request: WorkerRequest) => {
        capturedPayload = request.payload;
        mockWorker.simulateResponse({
          id: request.id,
          type: 'result',
          payload: { result: [1, 3], type: 'array' }
        });
      });
      
      await client.matrixOperation('solve', [coefficients], [5, 10]);
      
      expect(capturedPayload).toEqual({
        operation: 'solve',
        matrices: [coefficients],
        constants: [5, 10]
      });
    });
  });
  
  describe('generateGraphData', () => {
    it('should send graph request with correct parameters', async () => {
      let capturedPayload: unknown;
      
      mockWorker.setResponseHandler((request: WorkerRequest) => {
        capturedPayload = request.payload;
        mockWorker.simulateResponse({
          id: request.id,
          type: 'result',
          payload: { points: [], hasDiscontinuities: false }
        });
      });
      
      await client.generateGraphData('x^2', -10, 10, 100, { a: 2 });
      
      expect(capturedPayload).toEqual({
        expression: 'x^2',
        xMin: -10,
        xMax: 10,
        numPoints: 100,
        variables: { a: 2 }
      });
    });
    
    it('should use default numPoints when not provided', async () => {
      let capturedPayload: unknown;
      
      mockWorker.setResponseHandler((request: WorkerRequest) => {
        capturedPayload = request.payload;
        mockWorker.simulateResponse({
          id: request.id,
          type: 'result',
          payload: { points: [], hasDiscontinuities: false }
        });
      });
      
      await client.generateGraphData('x', 0, 10);
      
      expect((capturedPayload as { numPoints: number }).numPoints).toBe(500);
    });
  });
  
  describe('batchEvaluate', () => {
    it('should send batch request with all expressions', async () => {
      let capturedPayload: unknown;
      
      mockWorker.setResponseHandler((request: WorkerRequest) => {
        capturedPayload = request.payload;
        mockWorker.simulateResponse({
          id: request.id,
          type: 'result',
          payload: { results: [{ value: 2, formatted: '2' }, { value: 6, formatted: '6' }] }
        });
      });
      
      await client.batchEvaluate(['1 + 1', '2 * 3'], {
        precision: 20,
        angleMode: 'degrees',
        usePrecisionMode: true
      });
      
      expect(capturedPayload).toEqual({
        expressions: ['1 + 1', '2 * 3'],
        precision: 20,
        angleMode: 'degrees',
        usePrecisionMode: true
      });
    });
  });
  
  describe('progress reporting', () => {
    it('should call progress callback when progress messages are received', async () => {
      const progressCallback = vi.fn();
      
      mockWorker.setResponseHandler((request: WorkerRequest) => {
        // Send progress updates
        mockWorker.simulateResponse({
          id: request.id,
          type: 'progress',
          payload: { current: 1, total: 3, message: 'Processing...' }
        });
        
        mockWorker.simulateResponse({
          id: request.id,
          type: 'progress',
          payload: { current: 2, total: 3, message: 'Almost done...' }
        });
        
        // Send final result
        mockWorker.simulateResponse({
          id: request.id,
          type: 'result',
          payload: { value: 4, formatted: '4' }
        });
      });
      
      await client.evaluate('2 + 2', {}, progressCallback);
      
      expect(progressCallback).toHaveBeenCalledTimes(2);
      expect(progressCallback).toHaveBeenCalledWith({ current: 1, total: 3, message: 'Processing...' });
      expect(progressCallback).toHaveBeenCalledWith({ current: 2, total: 3, message: 'Almost done...' });
    });
  });
  
  describe('error handling', () => {
    it('should reject promise when error response is received', async () => {
      mockWorker.setResponseHandler((request: WorkerRequest) => {
        mockWorker.simulateResponse({
          id: request.id,
          type: 'error',
          payload: 'Division by zero'
        });
      });
      
      await expect(client.evaluate('1/0')).rejects.toThrow('Division by zero');
    });
    
    it('should reject all pending requests when worker errors', async () => {
      // Don't set up response handler - let requests hang
      const promise1 = client.evaluate('2 + 2');
      const promise2 = client.evaluate('3 + 3');
      
      // Simulate worker error
      mockWorker.simulateError(new Error('Worker crashed'));
      
      await expect(promise1).rejects.toThrow('Worker error');
      await expect(promise2).rejects.toThrow('Worker error');
    });
  });
  
  describe('terminate', () => {
    it('should terminate the worker and reject pending requests', async () => {
      // Don't respond - let request hang
      mockWorker.setResponseHandler(() => {});
      
      const promise = client.evaluate('2 + 2');
      
      // Terminate while request is pending
      client.terminate();
      
      await expect(promise).rejects.toThrow('Worker terminated');
    });
    
    it('should allow re-initialization after termination', async () => {
      mockWorker.setResponseHandler((request: WorkerRequest) => {
        mockWorker.simulateResponse({
          id: request.id,
          type: 'result',
          payload: { value: 4, formatted: '4' }
        });
      });
      
      await client.evaluate('2 + 2');
      client.terminate();
      
      // Create new mock worker for re-initialization
      const newMockWorker = new MockWorker();
      client.setWorkerFactory(() => newMockWorker as unknown as Worker);
      
      newMockWorker.setResponseHandler((request: WorkerRequest) => {
        newMockWorker.simulateResponse({
          id: request.id,
          type: 'result',
          payload: { value: 6, formatted: '6' }
        });
      });
      
      const result = await client.evaluate('3 + 3');
      expect(result.value).toBe(6);
    });
  });
  
  describe('isAvailable', () => {
    it('should check if Worker is available in the environment', () => {
      // In jsdom test environment, Worker may not be available
      // The method should return a boolean based on typeof Worker
      const result = client.isAvailable();
      expect(typeof result).toBe('boolean');
    });
  });
});
