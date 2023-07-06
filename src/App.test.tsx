import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest"
import { BrowserRouter as Router } from "react-router-dom";
import Register from "./components/Register";

test("render register page as homepage", () => {
    render(
        <Router>
            <Register />
        </Router>
    );
    const homepageElement = screen.getByTestId('register');
    expect(homepageElement).toBeTruthy()
})