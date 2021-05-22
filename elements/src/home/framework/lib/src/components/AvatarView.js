import React, { useState } from 'react'
import LoaderBusyWrapper from './_common/LoaderBusyWrapper'

const AvatarView = (props) => {

  const [didLoad, setLoad] = useState(false)

    const renderLoader = () => {
      return  <div className="app-avatar-loader">
                <div className="app-loader-busy light animate">
                  <LoaderBusyWrapper/>
                </div>
              </div>
    }

    const renderDropShadow = () => {
      return <img
        className={
          props.size === "small" ? "app-avatar small drop-shadow"
        : props.size === "large" ? "app-avatar large drop-shadow"
        : "app-avatar medium drop-shadow"
        }
        style={{
          objectFit: props.objectFit,
          width: props.width,
          height: props.height,
        }}
        src={props.src}
        alt={props.alt}
      />
    }

    const handleOnLoad = () => {
      setLoad(true)
    }

  return (
    <div className="app-avatar-container">
        <img
          className={
            props.size === "small" ? "app-avatar small"
          : props.size === "large" ? "app-avatar large"
          : "app-avatar medium"
          }
          src={props.src}
          alt={props.alt}
          style={{
            objectFit: props.objectFit,
            width: props.width,
            height: props.height,
          }}
          // onLoad={() => setLoad(true)}
          onLoad={() => { handleOnLoad(); props.onLoad() }}
          />

          {props.showDropShadow ? renderDropShadow() : ""}
          {props.isLoading ? renderLoader() : ""}
          {didLoad ? "" : renderLoader()}
    </div>
  )
}

AvatarView.defaultProps = {
  isLoading: false,
  objectFit: 'cover',
  alt: "avatar image",
  onLoad: () => {}
}

export default AvatarView