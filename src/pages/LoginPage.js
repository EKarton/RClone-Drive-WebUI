import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  TextField,
} from "@mui/material";
import axios from "axios";
import cx from "classnames";
import { useContext, useState } from "react";
import { useHistory } from "react-router";
import { actionTypes, store } from "../store";
import "./LoginPage.scss";

/**
 * The login page
 */
const LoginPage = () => {
  const { dispatch } = useContext(store);
  const history = useHistory();
  const [endpoint, setEndpoint] = useState(null);
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);
  const [error, setError] = useState(null);

  const handleTextEntered = (setFn) => (event) => {
    setFn(event.target.value);
  };

  const handleLogin = async () => {
    try {
      const axiosInstance = axios.create({
        responseType: "json",
        baseURL: endpoint,
        headers: {
          "Content-Type": "application/json",
        },
        auth: {
          username,
          password,
        },
      });

      const { data } = await axiosInstance.post("config/listremotes");

      dispatch({
        type: actionTypes.SET_AUTH,
        payload: { endpoint, username, password },
      });
      dispatch({
        type: actionTypes.SET_REMOTES,
        payload: data.remotes,
      });

      history.push("/dashboard");
    } catch (error) {
      setError(error);
    }
  };

  const cardSubHeader = (
    <span className={cx({ "login-page__card-subheader--red": error })}>
      {error ? error.message : "Enter your RClone info to get started"}
    </span>
  );

  return (
    <div className="login-page">
      <Card variant="outlined" className="login-page__card">
        <CardHeader title="Login" subheader={cardSubHeader} />
        <CardContent className="login-page__card-contents">
          <TextField
            required
            label="RClone RC Endpoint"
            variant="outlined"
            placeholder="Ex: http://localhost:5572"
            className="login-page__text-field"
            onChange={handleTextEntered(setEndpoint)}
            error={error}
          />
          <TextField
            required
            label="Username"
            variant="outlined"
            className="login-page__text-field"
            onChange={handleTextEntered(setUsername)}
            error={error}
          />
          <TextField
            required
            label="Password"
            variant="outlined"
            className="login-page__text-field"
            onChange={handleTextEntered(setPassword)}
            error={error}
          />
        </CardContent>
        <CardActions>
          <Button variant="contained" onClick={handleLogin}>
            Login
          </Button>
        </CardActions>
      </Card>
    </div>
  );
};

export default LoginPage;
