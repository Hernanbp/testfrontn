import { GoogleLogin } from "@react-oauth/google"
import { decodeJwt } from "jose"
import axios from "axios"
import { useState } from "react"

type User = {
  id: string
  name: string
  surname: string
  email: string
  phoneNumbers: string
  adress: string
  registerNumber: number
}

const App = () => {
  const [data, setData] = useState([])

  return (
    <div>
      <GoogleLogin
        onSuccess={(credentialResponse) => {
          console.log("credResponse:", credentialResponse)
          const { credential } = credentialResponse
          const payload = credential ? decodeJwt(credential) : undefined
          if (payload) {
            console.log("payload:", payload)
            typeof credential === "string" &&
              axios
                .get("http://127.0.0.1:5001/t-house-10/us-west2/user", {
                  headers: {
                    Authorization: `Bearer ${credential}`,
                  },
                })
                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                .then((response) => setData(response.data))
                .then(() => console.log(data))
                .catch((error) => console.log(error))
          }
        }}
        onError={(error: void) => console.log(error)}
        useOneTap
      />

      {data.map((item: User) => (
        <div
          style={{ fontFamily: "sans-serif", fontSize: ".875rem" }}
          key={item.id}
        >
          <p>Nombre: {item.name}</p>
          <p>Apellido: {item.surname}</p>
          <p>Email: {item.email}</p>
          <p>Telefonos: {item.phoneNumbers}</p>
          <p>Direccion: {item.adress}</p>
          <p>N° Matricula {item.registerNumber}</p>
        </div>
      ))}
    </div>
  )
}

export default App
