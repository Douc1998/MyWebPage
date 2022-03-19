import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import './BreadCrumb.scss';

export default function BreadCrumb(props) {

  const NavLinkItem = (props) => (
    <NavLink
      className="item"
      style={props.availableStyle}
      activeStyle={props.activeStyle}
      to={location => {
        return {
          ...location,
          pathname: props.targetURL,
        }
      }
      }
      exact
    >
      <span >{props.sperator}</span>
      <span style={{ position: 'relative', top: '1px' }}>{props.breadCrumbName}</span>
    </ NavLink>
  )

  const SpanItem = (props) => (
    <span className="item" style={props.style}>
      <span>{props.sperator}</span>
      <span style={{ position: 'relative', top: '1px' }}>{props.breadCrumbName}</span>
    </span>
  )

  const sperator = '> '; // 分隔符
  const activeStyle = {
    color: '#15FBF1',
    fontWeight: 'bold',
  };
  const forbiddenStyle = {
    color: '#D8DADA',
    cursor: 'not-allowed',
  };
  const availableStyle = {
    color: '#fff',
  }

  const createItem = ({ id, breadCrumbName, targetURL, status }) => {
    return (
      status ?
        (
          <NavLinkItem
            availableStyle={availableStyle}
            activeStyle={activeStyle}
            sperator={sperator}
            id={id}
            key={id}
            breadCrumbName={breadCrumbName}
            targetURL={targetURL}
          />
        ) :
        (
          <SpanItem
            style={forbiddenStyle}
            breadCrumbName={breadCrumbName}
            id={id}
            key={id}
            sperator={sperator}
          />
        )
    )
  }
  return (
    <span className="bread-crumb-ctn">
      {props.routes.map(item => createItem(item))}
    </span>
  )
}
