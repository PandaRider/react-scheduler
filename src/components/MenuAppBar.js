// Demo from https://material-ui-next.com/demos/app-bar/ (App Bar with Menu)
// Documentation available from https://material-ui-next.com/api/app-bar/ 
// SPECIAL NOTE: I've removed/modified about 10% of the original code for simplicity.
//
// Concept 1: Handling events - How to use buttons in React
// Task: Read and understand 
// Suggested reference: https://reactjs.org/docs/handling-events.html 
// 
// Concept 2: Third party (Material-UI) components - Library specific props
// Task: Try adding Buttons in the Appbar
// Suggested reference: https://material-ui-next.com/demos/buttons/
//
// Concept 3: Library specific styling
// Task: Try adding custom styling
// Suggested reference: https://material-ui-next.com/customization/overrides/ 
// Suggested reference 2: https://www.w3schools.com/jsref/dom_obj_style.asp 
// Addition comments: CSS is a huge topic and there's no widely accepted way of doing things. 
//                    Material-UI has their own way of doing things but allows traditional CSS too.
// 
//

import React from 'react';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import Menu, { MenuItem } from 'material-ui/Menu';
import MenuIcon from 'material-ui-icons/Menu';
import AccountCircle from 'material-ui-icons/AccountCircle';
import 'typeface-roboto' 
import { Link } from 'react-router-dom';

import * as Actions from '../actions';

const styles = {
    root: {
      width: '100%',
    },
    flex: {
      flex: 1,
    },
    menuButton: {
      marginLeft: -12,
      marginRight: 20,
    },
  };

class MenuAppBar extends React.Component {
    // state = {               // The "state" here may look different from the one from the videos or offical docs.
    //   anchorEl: false,      
    // };
    constructor(props) {                     //this is the equivalent syntax
        super(props)
        this.state = {
            anchorEl: false
        }
    }

    handleMenu = event => {
      this.setState({ anchorEl: event.currentTarget }); 
    };
  
    handleClose = () => {
      this.setState({ anchorEl: null });   // Do understand setState receives an object thus the curly brackets.
    };

    handleLogOut = () => {
        this.props.signOutUser();
    }
  
    render() {
      const { classes } = this.props;       // ES6 Deconstruction. This is extremely common in React.
      const { anchorEl } = this.state;      // Same as above. 
      const open = anchorEl;
  
      return (
        <div className={classes.root}>
          <AppBar position="static">
            <Toolbar>
              <IconButton className={classes.menuButton} color="inherit" aria-label="Menu">
                <MenuIcon />
              </IconButton>
              <Typography type="title" color="inherit" className={classes.flex}>
                Title
              </Typography>
                <div>
                    <IconButton
                    aria-owns={open ? 'menu-appbar' : null}
                    aria-haspopup="true"
                    onClick={this.handleMenu}
                    color="inherit"
                    >
                    <AccountCircle />
                    </IconButton>
                    <Menu
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    open={open}
                    onClose={this.handleClose}
                    >
                    <MenuItem onClick={this.handleClose}>Profile</MenuItem>
                    {/* <MenuItem onClick={this.handleClose}> */}
                    <MenuItem>
                      <Link to="/login">
                        Log Out
                      </Link>
                    </MenuItem>
                    </Menu>
                </div>
            </Toolbar>
          </AppBar>
        </div>
      );
    }
  }

export default withStyles(styles)(MenuAppBar); 
// Higher Order Component. Advanced concept but all you need to know is the MenuAppBar can receive styles through it's props.
