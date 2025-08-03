const request = require('supertest');
const express = require('express');
const { exec } = require('child_process');

// Mock the child_process.exec function
jest.mock('child_process', () => ({
  exec: jest.fn()
}));

// Create a mock Express app for testing .
const app = express();

// Recreate the endpoint for testing
app.get('/goose-version', (req, res) => {
  exec('goose --version', (error, stdout, stderr) => {
    if (error) return res.status(500).send(error.message);
    if (stderr) return res.status(500).send(stderr);
    res.send(stdout);
  });
});

describe('GET /goose-version', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('should return the goose version when command succeeds', async () => {
    // Mock successful execution of 'goose --version'
    exec.mockImplementation((command, callback) => {
      callback(null, 'goose version v1.2.3', null);
    });

    // Make request to the endpoint
    const response = await request(app)
      .get('/goose-version')
      .expect('Content-Type', /text/)
      .expect(200);

    // Check response
    expect(response.text).toBe('goose version v1.2.3');
    
    // Verify exec was called with correct command
    expect(exec).toHaveBeenCalledWith('goose --version', expect.any(Function));
  });
});
