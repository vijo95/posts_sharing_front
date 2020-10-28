import React, { useContext, useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { Button, Form } from 'semantic-ui-react';


import { AuthContext } from '../context/auth';
import { useForm } from '../util/hooks';

function Login(props) {
  const context = useContext(AuthContext)
  const [errors, setErrors] = useState({})

  const { onChange, onSubmit, values } = useForm(login,{
    username: '',
    password: ''
  })

  const [loginUser, { loading }] = useMutation(LOGIN_USER, {
    update(_, result){
      console.log(result);
      context.login(result.data.login)
      props.history.push('/')
    },
    onError(err){
      setErrors(err.graphQLErrors[0].extensions.exception.errors)
    },
    variables: values
  })

  function login(){
    loginUser()
  }


  return (
    <div className="form-container">
      <Form onSubmit={onSubmit} noValidate className={loading ? "loading" : ""}>
        <h1>Login</h1>
        <Form.Input 
          label="Username"
          placeholder="Username.."
          name="username"
          value={values.username}
          error={errors.username ? true : false}
          onChange={onChange}
          type="text"
        />
        <Form.Input 
          label="Password"
          placeholder="Password.."
          name="password"
          value={values.password}
          error={errors.password ? true : false}
          onChange={onChange}
          type="password"
        />
        <Button type="submit" primary>
          Login
        </Button>
      </Form>
      {Object.keys(errors).length > 0 && (
        <div className="ui error message">
          <ul className="list">
            {Object.values(errors).map(value => (
              <li key={value}>{value}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

const LOGIN_USER = gql`
  mutation login(
    $username: String!
    $password: String!
  ) {
    login(
      username: $username
      password: $password
    ) {
      id
      email
      username
      createdAt
      token
    }
  }
`

export default Login