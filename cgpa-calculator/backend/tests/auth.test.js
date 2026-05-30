const request = require('supertest');
const app = require('../src/server');

// NOTE: These tests require a live test DB.
// Set DATABASE_URL in your .env.test to point to a test database.

describe('Auth Routes', () => {
  const testUser = {
    name: 'Test Student',
    email: `test_${Date.now()}@amrita.edu`,
    password: 'password123',
  };
  let token;

  it('POST /api/auth/register — should create a new user', async () => {
    const res = await request(app).post('/api/auth/register').send(testUser);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user.email).toBe(testUser.email);
    token = res.body.token;
  });

  it('POST /api/auth/register — should reject duplicate email', async () => {
    const res = await request(app).post('/api/auth/register').send(testUser);
    expect(res.statusCode).toBe(409);
  });

  it('POST /api/auth/login — should log in successfully', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: testUser.email,
      password: testUser.password,
    });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  it('POST /api/auth/login — should reject wrong password', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: testUser.email,
      password: 'wrongpassword',
    });
    expect(res.statusCode).toBe(401);
  });

  it('GET /api/auth/me — should return user from token', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.email).toBe(testUser.email);
  });
});

describe('GPA Quick Calculate (no auth)', () => {
  it('POST /api/gpa/calculate — should compute SGPA correctly', async () => {
    const res = await request(app).post('/api/gpa/calculate').send({
      subjects: [
        { name: 'Maths', credits: 4, marks_obtained: 92 },  // O → 10
        { name: 'Physics', credits: 3, marks_obtained: 85 }, // A+ → 9
        { name: 'Chemistry', credits: 3, marks_obtained: 74 }, // A → 8
      ],
      college_name: 'Amrita Vishwa Vidyapeetham',
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.sgpa).toBeDefined();
    // (4*10 + 3*9 + 3*8) / 10 = (40+27+24)/10 = 9.1
    expect(res.body.sgpa).toBe(9.1);
  });
});
