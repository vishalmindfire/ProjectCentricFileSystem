import "@testing-library/jest-dom";
import { TextEncoder } from 'util';

global.TextEncoder = TextEncoder;

process.env.API_URL = 'https://api.escuelajs.co/api/v1';