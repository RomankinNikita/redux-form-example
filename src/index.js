import React from "react";
import ReactDOM from "react-dom";

import { createStore, combineReducers } from "redux";
import { Provider } from "react-redux";
import { reducer as formReducer } from "redux-form";

import { Field, reduxForm } from "redux-form";
import "./styles.css";

const rootReducer = combineReducers({
  form: formReducer
});

const store = createStore(rootReducer);

// Async simulate
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const showResult = async values => {
  await sleep(1000);
  window.alert(`You submitted: \n\n${JSON.stringify(values)}`);
};

// Validate function
const validate = values => {
  const errors = {};
  if (!values.username) {
    errors.username = "Обязательно поле";
  } else if (values.username.length > 15) {
    errors.username = "Должно быть не больше 15 символов";
  } else if (values.username.length < 3) {
    errors.username = "Должно быть не менее 3 символов";
  }
  if (!values.email) {
    errors.email = "Обязательно поле";
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = "Веедите электронную почту в формате xxx@xxx.xxx";
  }
  if (!values.age) {
    errors.age = "Обязательно поле";
  } else if (isNaN(Number(values.age))) {
    errors.age = "Введите число";
  } else if (Number(values.age) < 18) {
    errors.age = "Минимальный возраст - 18 лет";
  }
  return errors;
};

// Function that render input
const renderInput = ({
  input,
  label,
  placeholder,
  type,
  meta: { touched, error }
}) => {
  let inputClassName = "form-control";
  inputClassName =
    touched && error ? `${inputClassName} is-invalid` : inputClassName;

  return (
    <div className="form-group">
      <label htmlFor={label}>{label}</label>
      <input
        {...input}
        id={label}
        type={type}
        className={inputClassName}
        placeholder={placeholder}
      />
      {touched && error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
};

// Test form element
let Form = props => {
  const { handleSubmit, reset, submitting, pristine, valid } = props;

  return (
    <form className="container" onSubmit={handleSubmit(showResult)}>
      {/* First Name */}
      <Field
        name="username"
        component={renderInput}
        type="text"
        placeholder="Enter your name"
        label="Username"
      />

      {/* Email */}
      <Field
        name="email"
        component={renderInput}
        type="email"
        placeholder="Enter your email"
        label="Email"
      />

      {/* Age */}
      <Field
        name="age"
        component={renderInput}
        type="number"
        placeholder="Enter your age"
        label="Age"
      />

      {/* Button block */}
      <div
        className="d-flex justify-content-between"
        style={{ width: "150px" }}
      >
        <button
          disabled={!valid || submitting}
          type="submit"
          className="btn btn-primary"
        >
          Submit
        </button>
        <button
          disabled={pristine || submitting}
          type="button"
          className="btn btn-secondary"
          onClick={reset}
        >
          Clear
        </button>
      </div>
    </form>
  );
};

Form = reduxForm({
  form: "testForm",
  validate
})(Form);

const rootElement = document.getElementById("root");
ReactDOM.render(
  <Provider store={store}>
    <Form />
  </Provider>,
  rootElement
);
