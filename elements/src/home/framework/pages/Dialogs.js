import React from 'react'
import { NavPageContainer, AvatarView,
         Dialog, Alert, Button, ListItem } from '../lib'
import AvatarImg from '../../img/anim_avatar.jpeg'
import Img2 from '../../img/illustration/2.jpg'
import Img3 from '../../img/illustration/3.jpg'
import Img4 from '../../img/illustration/4.jpg'


class Lists extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showDialog: false,
            showDialogConfirm: false,
            showAlert: false,
            showAlertLight: false
        }
    }

    toggleDialog = () => {
        if(this.state.showDialog)
                this.setState({showDialog: false});
        else    this.setState({showDialog: true});
    }
    toggleDialogConfirm = () => {
        if(this.state.showDialogConfirm)
                this.setState({showDialogConfirm: false});
        else    this.setState({showDialogConfirm: true});
    }

    toggleAlert = () => {
        if(this.state.showAlert)
                this.setState({showAlert: false});
        else    this.setState({showAlert: true});
    }

    toggleAlertLight = () => {
        if(this.state.showAlertLight)
                this.setState({showAlertLight: false});
        else    this.setState({showAlertLight: true});
    }


    render() {
      return (
        <NavPageContainer hasPadding>
                
        <h1>Dialogs</h1>

        <br/>
        <div className="app-flex app-align-center">
            <AvatarView
                size="large"
                src={AvatarImg}
                showDropShadow/>
            &nbsp;&nbsp;
            <div className="app-grid">
                <AvatarView
                    size="small"
                    src={Img2}
                    showDropShadow/>
                &nbsp;
                <AvatarView
                    size="small"
                    src={Img3}
                    showDropShadow/>
            </div>
        </div>


        <br/>

        <h3 className="m-b-15">Dialog</h3>
        <Button
            value="Open Dialog"
            onClick={this.toggleDialog}/>

        <br/><br/>

        <Button
            value="Open Dialog Confirm"
            onClick={this.toggleDialogConfirm}/>    
  
        <Dialog
          isVisible={this.state.showDialog}
          onBackdropPress={this.toggleDialog}
          showDropShadow={true}>
            <ListItem
                img={Img4}
                imgBorderRadius={8}
                title="Magenta Riddim"
                subtitle="5.6 MB"/>
            <ListItem
                img={Img3}
                imgBorderRadius={8}
                title="Different World"
                subtitle="12.0 MB"/>
            <ListItem
                img={Img2}
                imgBorderRadius={8}
                title="La Familia"
                subtitle="24 MB"/>
               
            <div style={{padding:'10px',float:'right'}}>
                <Button
                    value="Close"
                    onClick={this.toggleDialog}/>
            </div>
        </Dialog>

        <Dialog
          isVisible={this.state.showDialogConfirm}
          onBackdropPress={this.toggleDialogConfirm}
          showDropShadow={true}>
            <div style={{padding:'15px 15px 15px 25px'}}>
            <h2 className="m-tb-10">Dialog Confirm</h2>
            <h3>Are you feel good today?</h3>  
            <div style={{display:'flex',justifyContent:'flex-end'}}>
                <Button
                    value="Cancel"
                    type="danger-outline"
                    onClick={this.toggleDialogConfirm}/>
                <div className="app-space-15"></div>
                <Button
                    value="OK"
                    onClick={this.toggleDialogConfirm}/>
            </div>
            </div>
        </Dialog>

        {/* -------------------------------------------------------------------- */}

        <h2 className="m-b-15">Alerts</h2>

        <Button value="Open Alert Primary" 
            onClick={this.toggleAlert}
        />
        <br/><br/>
        <Button value="Open Alert Light"
            onClick={this.toggleAlertLight}
        />
  
        <Alert
          isVisible={this.state.showAlert}
          onBackdropPress={this.toggleAlert}
          title="Alert"
          message="This is alert Box.">
            <button onClick={this.toggleAlert}>OK</button>
        </Alert>

        <Alert
          isVisible={this.state.showAlertLight}
          onBackdropPress={this.toggleAlertLight}
          setTheme="light"
          title={<><i className="icons10-sun"></i>Alert</>}
          message="This is Light alert Box.">
            <button onClick={this.toggleAlertLight}>OK</button>
        </Alert>

        <br/><br/>
  
        </NavPageContainer>
      )
    }
  }


export default Lists