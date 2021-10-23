import axios from "axios";
import { useEffect, useState } from "react";

const BASE_URL = "http://localhost:5572/";

const DashboardPage = () => {
  const [remotes, setRemotes] = useState([]);

  useEffect(() => {
    const fetchAndSetData = async () => {
      const axiosInstance = axios.create({
        responseType: "json",
        baseURL: BASE_URL,
        headers: {
          "Content-Type": "application/json",
        },
        auth: {
          username: "local",
          password: "12345",
        },
      });

      const { data } = await axiosInstance.post("config/listremotes");
      console.log(data);
      setRemotes(data);

      console.log(
        await axiosInstance.post("operations/list", {
          fs: "googledrive-main-encrypted:",
          remote: "Documents/Personal/Desktop Computer Parts",
        })
      );
    };

    fetchAndSetData();
  }, [setRemotes]);

  return <div>Dashboard!</div>;
};

export default DashboardPage;
