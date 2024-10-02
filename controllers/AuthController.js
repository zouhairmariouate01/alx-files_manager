import { v4 as uuidv4 } from 'uuid';
import sha1 from 'sha1';
import redisClient from '../utils/redis';
import userUtils from '../utils/user';

class AuthController {
  /**
   * Should sign-in the user by generating a new authentication token
   *
   * By using the header Authorization and the technique of the Basic auth
   * (Base64 of the <email>:<password>), find the user associate to this email
   * and with this password (reminder: we are storing the SHA1 of the password)
   * If no user has been found, return an error Unauthorized with a status code 401
   * Otherwise:
   * Generate a random string (using uuidv4) as token
   * Create a key: auth_<token>
   * Use this key for storing in Redis (by using the redisClient create previously)
   * the user ID for 24 hours
   * Return this token: { "token": "155342df-2399-41da-9e8c-458b6ac52a0c" }
   * with a status code 200
   */
  static async getConnect(request, response) {
    const Authorization = request.header('Authorization') || '';

    const credentials = Authorization.split(' ')[1];

    if (!credentials) { return response.status(401).send({ error: 'Unauthorized' }); }

    const decodedCredentials = Buffer.from(credentials, 'base64').toString(
      'utf-8',
    );

    const [email, password] = decodedCredentials.split(':');

