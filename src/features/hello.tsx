import React from "react"

interface HelloWorldProps {}
export const HelloWorld = ({}:HelloWorldProps) => (
  <>
    <div className="vw-100 vh-100 primary-color d-flex align-items-center justify-content-center">
      <div className="jumbotron jumbotron-fluid bg-transparent">
        <div className="container secondary-color">
          <h1 className="display-4">Hello World!</h1>
          <p className="lead">
            If this looks pretty, then Bootstrap is working!
          </p>
          <hr className="my-4" />
          <button
            className="btn btn-lg btn-primary"
            role="button"
            onClick={ () => {alert('No Touchy Touchy!')} } >
            Sample Button
          </button>
        </div>
      </div>
    </div>
  </>
)