import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock Chrome API
global.chrome = {
  runtime: {
    sendMessage: vi.fn(),
    onMessage: {
      addListener: vi.fn(),
    },
    lastError: null,
  },
  storage: {
    sync: {
      get: vi.fn(),
      set: vi.fn(),
    },
    local: {
      get: vi.fn(),
      set: vi.fn(),
    },
    onChanged: {
      addListener: vi.fn(),
    },
  },
  tabs: {
    query: vi.fn(),
  },
  sidePanel: {
    setPanelBehavior: vi.fn().mockReturnValue(Promise.resolve()),
  },
  declarativeNetRequest: {
    updateDynamicRules: vi.fn().mockReturnValue(Promise.resolve()),
    RuleActionType: { MODIFY_HEADERS: 'modifyHeaders' },
    HeaderOperation: { SET: 'set' },
    ResourceType: { SUB_FRAME: 'sub_frame' },
  },
} as unknown as typeof chrome
