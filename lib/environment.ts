export const getEnvironmentConfig = () => {
  const isClient = typeof window !== 'undefined'
  const isDevelopment = process.env.NODE_ENV === 'development'
  const isProduction = process.env.NODE_ENV === 'production'
  
  const config = {
    development: {
      socketUrl: 'http://localhost:3001',
      serverUrl: 'http://localhost:3001'
    },
    production: {
      socketUrl: process.env.NEXT_PUBLIC_SOCKET_URL,
      serverUrl: process.env.NEXT_PUBLIC_SERVER_URL
    }
  }
  
  const environment = isDevelopment ? 'development' : 'production'
  
  return {
    socketUrl: config[environment].socketUrl,
    serverUrl: config[environment].serverUrl,
    isClient,
    isDevelopment,
    isProduction
  }
}

export default getEnvironmentConfig
