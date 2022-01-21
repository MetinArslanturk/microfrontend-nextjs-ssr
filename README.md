# Description
A framework agnostic implementation of microfrontend with Module Federation of Webpack 5. It supports SSR and shared modules (even nextjs has them eager the remote app never re-fetches the shared libs). Also, it has dynamic support for module federation. So, remote module urls can be changed without re-building the app and can be given in runtime.

## You can find a detailed explanation in medium blog post which written by me:
https://medium.com/@metinarslanturkk/how-i-implemented-dynamic-loaded-framework-agnostic-microfrontend-app-with-nextjs-and-react-which-620ff3df4298

# Running

- At the first time execute ```yarn install``` in _next-host_ and _react-remote_ folders.

For a __development run__, follow steps order respectively (in different terminal tabs):

- Execute ```yarn server``` in _react-remote_ folder
- Execute ```yarn dev``` in _react-remote_ folder
- Execute ```yarn dev``` in _next-host_ folder

Go to http://localhost:3000 Check it and have fun.

For a __production run__, follow steps order respectively (in different terminal tabs):

- Execute ```yarn server:prod``` in _react-remote_ folder
- Execute ```yarn build``` in _react-remote_ folder and Execute ```yarn start``` in _react-remote_ folder
- Execute ```yarn build``` in _next-host_ folder and Execute ```yarn start``` in _next-host_ folder

Go to http://localhost:3000 Check it and have fun.