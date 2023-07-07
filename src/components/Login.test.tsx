import { render, screen } from "@testing-library/react"
import { describe, expect, test } from "vitest"
import { BrowserRouter as Router } from "react-router-dom"
import Login from "./Login"
import * as yup from 'yup';
import { Provider } from "react-redux";
import { configureStore } from '@reduxjs/toolkit'
import { rootReducer } from '../components/redux/reducers'

test('render Register page correctly', () => {
    const store = configureStore({
      reducer: rootReducer
  });
    render(
      <Provider store={store}>
        <Router>
          <Login />
        </Router>
      </Provider>
    )
    const registerPage = screen.getByTestId('login');
    expect(registerPage).toBeTruthy()
})

describe('Login Form Validation Schema', () => {
  test('should require a valid email address', async () => {
    const schema = yup.object().shape({
      email: yup.string().email('Please enter a valid email address.').required('Email is required.'),
    });
    const validData = { email: 'test@example.com' };
    const invalidData = { email: 'invalid_email' };
    await expect(schema.validate(validData)).resolves.toBe(validData);
    await expect(schema.validate(invalidData)).rejects.toThrow('Please enter a valid email address.');
  });

  test('should require a password of at least 8 characters with one letter and one number', async () => {
    const schema = yup.object().shape({
      password: yup
        .string()
        .min(8, 'Password must be at least 8 characters long.')
        .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, 'Password must contain at least one letter and one number.')
        .required('Password is required.'),
    });

    const validData = { password: 'password123' };
    const invalidDataShort = { password: 'short' };
    const invalidDataNoLetterNumber = { password: '12345678' };

    await expect(schema.validate(validData)).resolves.toBe(validData);
    await expect(schema.validate(invalidDataShort)).rejects.toThrow('Password must be at least 8 characters long.');
    await expect(schema.validate(invalidDataNoLetterNumber)).rejects.toThrow(
      'Password must contain at least one letter and one number.'
    );
  });
});
