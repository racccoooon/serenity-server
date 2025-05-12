import axios from "axios";
import {config} from "../config/settings.js";

export const serenityClient = axios.create();
serenityClient.interceptors.request.use(c => {
    c.transformRequest.append((data, headers) => {
        headers.add('x-instance', config.server.domain);

        //TODO: implement signing request with private key

        return data;
    });
});