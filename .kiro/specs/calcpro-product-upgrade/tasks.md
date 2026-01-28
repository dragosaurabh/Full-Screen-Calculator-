# Implementation Plan: CalcPro Product Upgrade

## Overview

This implementation plan converts the CalcPro product upgrade design into actionable coding tasks. The approach prioritizes setting up the routing infrastructure first, then implementing the preference persistence system, followed by UI component enhancements, and finally the dedicated pages.

## Tasks

- [x] 1. Set up React Router infrastructure
  - [x] 1.1 Install and configure React Router
    - Add react-router-dom dependency
    - Create router configuration in src/router/
    - Set up BrowserRouter in main.tsx
    - _Requirements: 7.1_
  
  - [x] 1.2 Create route definitions for all pages
    - Define routes for all calculator modes (/basic-calculator, /scientific-calculator, etc.)
    - Define routes for /help and /privacy
    - Configure 404 catch-all route
    - _Requirements: 4.1, 4.7, 7.4_
  
  - [ ]* 1.3 Write property test for route navigation
    - **Property 3: Route Navigation**
    - **Validates: Requirements 4.1, 4.2, 7.3, 7.5**

- [x] 2. Implement preference persistence system
  - [x] 2.1 Create PreferenceStore module
    - Implement UIPreferences interface
    - Create getPreference/setPreference methods
    - Implement persist/restore with LocalStorage
    - Add subscription mechanism for reactive updates
    - _Requirements: 10.1, 10.2, 10.3_
  
  - [x] 2.2 Implement safe LocalStorage utilities
    - Create safeGetFromStorage function with error handling
    - Create safeSetToStorage function with error handling
    - Handle LocalStorage unavailability gracefully
    - _Requirements: 10.4_
  
  - [ ]* 2.3 Write property tests for preference persistence
    - **Property 1: Preference Persistence Round-Trip**
    - **Validates: Requirements 1.4, 5.6, 6.3, 10.1, 10.2**
  
  - [ ]* 2.4 Write property test for preference restoration
    - **Property 2: Preference Restoration**
    - **Validates: Requirements 1.5, 6.4, 10.3**

- [x] 3. Checkpoint - Ensure routing and preferences work
  - Ensure all tests pass, ask the user if questions arise.

- [x] 4. Enhance History Panel with guidance controls
  - [x] 4.1 Add guidance visibility toggle to HistoryPanel
    - Add guidanceVisible prop and onGuidanceToggle callback
    - Implement Show/Hide guidance button in panel header
    - Connect to PreferenceStore for persistence
    - _Requirements: 1.3, 1.4, 1.6_
  
  - [x] 4.2 Implement persistent guidance section
    - Ensure guidance remains visible after calculations
    - Show guidance in empty state
    - Respect user's visibility preference
    - _Requirements: 1.1, 1.2, 2.2_
  
  - [x] 4.3 Implement collapsed pinned view
    - Create CollapsedPinnedView component
    - Show pinned entries when panel is collapsed
    - Enable re-run from collapsed view
    - _Requirements: 2.5_
  
  - [ ]* 4.4 Write property tests for history panel
    - **Property 5: History Panel Guidance Visibility**
    - **Property 6: History Panel Structure**
    - **Validates: Requirements 1.1, 1.2, 2.2, 2.3, 2.4, 2.5**
  
  - [ ]* 4.5 Write property test for pinned entry operations
    - **Property 12: Pinned Entry Operations**
    - **Validates: Requirements 2.7, 2.8**

- [x] 5. Update Header with navigation links
  - [x] 5.1 Add Help and Privacy navigation links
    - Add Help link to header navigation
    - Add Privacy link to header navigation
    - Style links consistently with existing header
    - _Requirements: 8.1, 8.2_
  
  - [x] 5.2 Implement mode highlighting in header
    - Display current mode name in header
    - Highlight active mode in navigation
    - Ensure consistency across all pages
    - _Requirements: 8.3, 8.4, 8.5_
  
  - [ ]* 5.3 Write property test for header consistency
    - **Property 10: Header Consistency**
    - **Validates: Requirements 8.3, 8.4, 8.5**

- [x] 6. Implement UI visibility toggle system
  - [x] 6.1 Create toggle controls for all UI elements
    - Add toggle for History Panel
    - Add toggle for Guidance sections
    - Add toggle for Educational Content
    - Add toggle for Help tips
    - _Requirements: 6.1_
  
  - [x] 6.2 Connect toggles to PreferenceStore
    - Wire each toggle to corresponding preference
    - Ensure immediate persistence on change
    - Restore preferences on load
    - _Requirements: 6.2, 6.3, 6.4, 6.5_
  
  - [ ]* 6.3 Write property test for toggle behavior
    - **Property 8: Toggle Behavior Consistency**
    - **Validates: Requirements 6.2**

- [x] 7. Checkpoint - Ensure UI controls work correctly
  - Ensure all tests pass, ask the user if questions arise.

- [x] 8. Create Help Page
  - [x] 8.1 Create HelpPage component structure
    - Create src/pages/HelpPage.tsx
    - Implement section-based layout
    - Add search input for filtering topics
    - _Requirements: 3.1, 3.4, 3.5_
  
  - [x] 8.2 Implement help content sections
    - Create Getting Started section
    - Create Keypad Usage section
    - Create Keyboard Shortcuts section
    - Create Calculator Modes section
    - Create Common Errors section
    - Create History & Pinning section
    - Create Layout Modes section
    - Create Privacy section
    - Create FAQs section
    - _Requirements: 3.4_
  
  - [x] 8.3 Add cross-links and mode links
    - Add related topic links within sections
    - Add links to all calculator mode pages
    - _Requirements: 3.6, 3.7_
  
  - [x] 8.4 Add SEO meta tags to Help Page
    - Set page title
    - Add meta description
    - Ensure crawlability
    - _Requirements: 3.2, 3.3, 3.8_
  
  - [ ]* 8.5 Write property test for help search
    - **Property 7: Help Search Filtering**
    - **Validates: Requirements 3.5**

- [x] 9. Create Privacy Page
  - [x] 9.1 Create PrivacyPage component
    - Create src/pages/PrivacyPage.tsx
    - Add privacy policy content
    - Add SEO meta tags
    - _Requirements: 4.7_

- [x] 10. Create Calculator Mode Pages
  - [x] 10.1 Create CalculatorPage wrapper component
    - Create src/pages/CalculatorPage.tsx
    - Accept mode prop from route
    - Render CalculatorLayout with correct mode
    - _Requirements: 4.2_
  
  - [x] 10.2 Implement SEO metadata for mode pages
    - Add unique title tags per mode
    - Add meta descriptions per mode
    - Add structured data markup (JSON-LD)
    - _Requirements: 4.3, 4.4, 9.1, 9.2, 9.3_
  
  - [x] 10.3 Add internal links between mode pages
    - Add links to other calculators in footer
    - Add links in sidebar
    - _Requirements: 4.5_
  
  - [x] 10.4 Implement URL sync on mode switch
    - Update URL when mode changes via sidebar
    - Use React Router navigation
    - _Requirements: 4.6_
  
  - [ ]* 10.5 Write property test for mode page content
    - **Property 4: Mode Page Content Completeness**
    - **Validates: Requirements 4.3, 4.4, 5.1, 5.2, 5.3, 9.1, 9.2, 9.3**
  
  - [ ]* 10.6 Write property test for mode switch URL sync
    - **Property 13: Mode Switch URL Sync**
    - **Validates: Requirements 4.6**

- [x] 11. Enhance Educational Content section
  - [x] 11.1 Make educational content collapsible
    - Add collapse/expand toggle to Footer component
    - Connect to PreferenceStore for persistence
    - Default to visible on first visit
    - _Requirements: 5.4, 5.5, 5.6_
  
  - [x] 11.2 Prevent auto-hide behavior
    - Ensure content stays in user-set state
    - Remove any auto-collapse logic
    - _Requirements: 5.7_

- [x] 12. Checkpoint - Ensure all pages render correctly
  - Ensure all tests pass, ask the user if questions arise.

- [x] 13. Implement browser navigation support
  - [x] 13.1 Handle back/forward navigation
    - Ensure correct page displays on history navigation
    - Update document title on navigation
    - _Requirements: 7.2, 7.6_
  
  - [x] 13.2 Implement 404 page
    - Create NotFoundPage component
    - Add navigation links to valid pages
    - _Requirements: 7.4_
  
  - [ ]* 13.3 Write property test for browser navigation
    - **Property 9: Browser Navigation**
    - **Validates: Requirements 7.2, 7.6**
  
  - [ ]* 13.4 Write property test for invalid route handling
    - **Property 14: Invalid Route Handling**
    - **Validates: Requirements 7.4**

- [x] 14. Accessibility compliance
  - [x] 14.1 Ensure keyboard accessibility
    - Verify all interactive elements are focusable
    - Add keyboard event handlers where needed
    - Test tab navigation flow
    - _Requirements: 9.6_
  
  - [x] 14.2 Add accessibility attributes
    - Add alt text to images
    - Add aria-labels to icons
    - Use semantic HTML elements
    - _Requirements: 9.4, 9.7_
  
  - [ ]* 14.3 Write property test for accessibility
    - **Property 11: Accessibility Compliance**
    - **Validates: Requirements 9.6, 9.7**

- [x] 15. Final integration and wiring
  - [x] 15.1 Wire App component with router
    - Update App.tsx to use router
    - Connect all pages to routes
    - Ensure preference restoration on app load
    - _Requirements: 7.1, 10.3_
  
  - [x] 15.2 Add error boundaries
    - Implement AppErrorBoundary component
    - Wrap application with error boundary
    - Add fallback UI for errors
    - _Requirements: Error handling_

- [x] 16. Final checkpoint - Complete testing
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties
- Unit tests validate specific examples and edge cases
- React Router v6 should be used for routing implementation
- fast-check library (already installed) should be used for property-based tests
