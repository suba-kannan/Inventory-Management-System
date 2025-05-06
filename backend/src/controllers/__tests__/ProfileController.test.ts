import { Request, Response } from 'express';
import { getProfile, editProfile } from '../ProfileController';
import { AppDataSource } from '../../config/data-source';
import { User } from '../../entities/User';
import bcrypt from 'bcryptjs';

jest.mock('../../config/data-source', () => ({
  AppDataSource: {
    getRepository: jest.fn()
  }
}));

const mockUser = {
  id: 1,
  name: 'John Doe',
  email: 'john@example.com',
  phone: '1234567890',
  password: 'hashedpassword',
};

const getMockReqRes = (overrides = {}) => {
  const req = {
    user: { id: 1 },
    body: {},
    ...overrides,
  } as unknown as Request;

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as unknown as Response;

  return { req, res };
};

describe('Profile Controller', () => {
  let findOneMock: jest.Mock;
  let saveMock: jest.Mock;

  beforeEach(() => {
    findOneMock = jest.fn();
    saveMock = jest.fn();
    (AppDataSource.getRepository as jest.Mock).mockReturnValue({
      findOne: findOneMock,
      save: saveMock
    });
  });

  describe('getProfile', () => {
    it('should return user data without password', async () => {
      findOneMock.mockResolvedValue(mockUser);
      const { req, res } = getMockReqRes();

      await getProfile(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.not.objectContaining({ password: expect.any(String) }));
    });

    it('should return 404 if user not found', async () => {
      findOneMock.mockResolvedValue(null);
      const { req, res } = getMockReqRes();

      await getProfile(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
    });

    it('should handle internal errors', async () => {
      findOneMock.mockRejectedValue(new Error('DB error'));
      const { req, res } = getMockReqRes();

      await getProfile(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Failed to fetch profile' }));
    });
  });

  describe('editProfile', () => {
    it('should update and return user without password', async () => {
      findOneMock.mockResolvedValue({ ...mockUser });
      saveMock.mockResolvedValue(true);

      const { req, res } = getMockReqRes({
        body: {
          name: 'Jane Doe',
          email: 'jane@example.com',
          phone: '9876543210',
          password: 'newpassword'
        }
      });

      const hashedPassword = "hashedNewPassword";
      (jest.spyOn(bcrypt, 'hash') as jest.Mock).mockResolvedValueOnce('hashedNewPassword');


      await editProfile(req, res);

      expect(saveMock).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.not.objectContaining({ password: expect.any(String) }));
    });

    it('should return 404 if user not found', async () => {
      findOneMock.mockResolvedValue(null);
      const { req, res } = getMockReqRes();

      await editProfile(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
    });

    it('should handle internal errors', async () => {
      findOneMock.mockRejectedValue(new Error('DB error'));
      const { req, res } = getMockReqRes();

      await editProfile(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Failed to update profile' }));
    });
  });
});
