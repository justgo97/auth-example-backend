import jwt from "jsonwebtoken";

interface DecodedToken {
  token: string;
}

const secretKey = process.env.JWT_SECRET!;

// Creates a token based on a given string
const generateToken = (tokenBase: string) => {
  const payload = { token: tokenBase };
  const token = jwt.sign(payload, secretKey, {
    expiresIn: "300d",
  });
  return token;
};

// Verify a JWT token
function verifyToken(token: string) {
  return new Promise<DecodedToken>((resolve, reject) => {
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        reject(err); // Token verification failed
      } else {
        resolve(decoded as DecodedToken); // Token is valid
      }
    });
  });
}

export { generateToken, verifyToken };
