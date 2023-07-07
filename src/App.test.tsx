import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest"
import { BrowserRouter as Router } from "react-router-dom";
import Register from "./components/Register";
import { Provider } from "react-redux";
import { configureStore } from '@reduxjs/toolkit'
import { rootReducer } from './components/redux/reducers'

test("render register page as homepage", () => {
    const store = configureStore({
        reducer: rootReducer
    })
    render(
        <Provider store={store}>
            <Router>
                <Register />
            </Router>
        </Provider>
    );
    const homepageElement = screen.getByTestId('register');
    expect(homepageElement).toBeTruthy()
})