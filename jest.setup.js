import "@testing-library/jest-dom";

// ✅ Mocks globales

// --- MOCK Next.js navigation ---
jest.mock('next/navigation', () => {
  return {
    useRouter: jest.fn(() => ({
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      pathname: '/mock-path',
    })),
    usePathname: jest.fn(() => '/mock-path'),
    useSearchParams: jest.fn(() => new URLSearchParams()),
  };
});

// --- MOCK Appwrite ---

jest.mock('node-appwrite/file', () => ({
  InputFile: jest.fn(),
}));

jest.mock('node-appwrite', () => {
  const mockClient = jest.fn().mockImplementation(() => ({
    setEndpoint: jest.fn().mockReturnThis(),
    setProject: jest.fn().mockReturnThis(),
    setKey: jest.fn().mockReturnThis(),
  }));

  const mockAccount = jest.fn().mockImplementation(() => ({
    get: jest.fn(),
    create: jest.fn(),
    updateEmail: jest.fn(),
  }));

  const mockStorage = jest.fn().mockImplementation(() => ({
    createFile: jest.fn(),
    getFile: jest.fn(),
  }));

  const mockMessaging = jest.fn().mockImplementation(() => ({
    createMessage: jest.fn(),
    getMessages: jest.fn(),
  }));

  const mockID = {
    unique: jest.fn().mockReturnValue('mock-id'),
  };

  return {
    Client: mockClient,
    Account: mockAccount,
    Storage: mockStorage,
    Messaging: mockMessaging,
    ID: mockID,
    Teams: jest.fn().mockImplementation(() => ({})),
    Databases: jest.fn().mockImplementation(() => ({})),
    Functions: jest.fn().mockImplementation(() => ({})),
    Realtime: jest.fn().mockImplementation(() => ({})),
    Query: jest.fn(),
  };
});
