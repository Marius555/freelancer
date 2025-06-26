"use server"

import * as jose from 'jose';


const decript = async (value) => {
  try {
    const {payload} = await jose.jwtVerify(value, new TextEncoder().encode(process.env.JWT_KEY),{
        algorithms: ['HS256']
      })
      return payload
  } catch (error) {
    console.error(error);
  }
}

export default decript
