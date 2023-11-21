/* eslint-disable @typescript-eslint/no-misused-promises */
import { GoogleLogin } from "@react-oauth/google"
import { JWTPayload, decodeJwt } from "jose"
import axios from "axios"
import { FormEventHandler, SyntheticEvent, useEffect, useState } from "react"

type User = {
  id: string
  name: string
  surname: string
  email: string
  phoneNumbers: string
  adress: string
  registerNumber: number
}

interface Data {
  accessToken: string
}

const App = () => {
  const [data, setData] = useState<Data>({ accessToken: "" })
  const [id, setId] = useState("") // Estado para almacenar el ID del usuario
  const [name, setName] = useState("")

  const [decodedToken, setDecodedToken] = useState<JWTPayload | null>(null)

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault()
    const url = `http://127.0.0.1:5001/t-house-10/us-west2/api/user/${id}`

    try {
      const res = await axios.patch(
        url,
        {
          name: name,
        },
        {
          headers: {
            Authorization: `Bearer ${data.accessToken}`,
          },
        }
      )

      console.log("handle:", res)
    } catch (error) {
      console.error("Error en la solicitud:", error)
    }
  }

  useEffect(() => {
    console.log(data)
  }, [data])

  return (
    <div className="h-screen bg-gray-50">
      <div className="container flex flex-col items-center justify-center mx-auto">
        <div className="p-4 mt-10 bg-white border shadow-sm">
          <div className="rounded-md max-w-fit">
            <h2 className="mb-4 text-2xl font-semibold">Login</h2>
            <GoogleLogin
              onSuccess={(credentialResponse) => {
                console.log("credResponse:", credentialResponse)
                const { credential } = credentialResponse
                const payload = credential ? decodeJwt(credential) : undefined
                if (payload) {
                  console.log("payload:", payload)
                  console.log(payload.email)
                  typeof credential === "string" &&
                    axios
                      .post(
                        "http://127.0.0.1:5001/t-house-10/us-west2/api/user/auth/google",
                        {
                          email: payload.email,
                        },
                        {
                          headers: {
                            Authorization: `Bearer ${credential}`,
                          },
                        }
                      )
                      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                      .then((response) => setData(response.data))
                      .catch((error) => console.log("el error es:", error))
                }
              }}
              onError={(error: void) => console.log("OnERROR ACA:", error)}
              useOneTap
            />
          </div>

          <div className="flex flex-col max-w-sm p-2 mt-4 text-yellow-500 border rounded-md shadow-sm">
            <h2 className="text-sm font-medium">Respuesta del servidor:</h2>
            <p className="block mt-2 overflow-y-auto text-xs text-gray-900 break-all max-h-40">
              {data.accessToken}
            </p>
          </div>

          <div className="text-sm">
            <h2 className="mt-4 font-medium">Actualizar Nombre de Usuario</h2>
            <form className="mt-2" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-1">
                <label htmlFor="userId">ID de Usuario:</label>
                <input
                  className="p-1 text-sm border border-gray-300 rounded-md shadow-sm"
                  type="text"
                  id="userId"
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="newName">Nuevo Nombre:</label>
                <input
                  className="p-1 text-sm border border-gray-300 rounded-md shadow-sm"
                  type="text"
                  id="newName"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="mt-4">
                <button
                  className="p-2 px-4 text-white bg-black rounded-md"
                  type="submit"
                >
                  Actualizar Nombre
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
