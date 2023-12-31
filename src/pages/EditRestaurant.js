import React, { useEffect, useState } from "react";
import './EditRestaurant.css';
import HeaderRestaurant from '../components/HeaderRestaurant';
import axios from "axios";
import Footer from "../components/Footer";
import dayjs from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers';
import { Link, useParams } from 'react-router-dom';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { Alert, AlertTitle, Dialog, FormControlLabel} from "@mui/material";
import { useHistory } from "react-router-dom";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import PhoneInput from 'material-ui-phone-number';
import LockIcon from '@mui/icons-material/Lock';
import { Visibility, VisibilityOff } from "@material-ui/icons";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Avatar, Box, Button, createTheme, DialogContent, DialogTitle, Divider, FormControl, Grid, Icon, IconButton, InputAdornment, TextField, ThemeProvider, Typography, withStyles, makeStyles } from "@material-ui/core";
import ClearIcon from '@mui/icons-material/Clear';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import Chat from "../components/Chat";
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import Map from "../components/Map/Map";
import Modal from '@mui/material/Modal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const styles = theme => ({
    field: {
      margin: '10px 0',
      width : "100px",
    },
    countryList: {
      ...theme.typography.body1,
      width : "100px",
    },
    dialogRoot: {
        width: '100%',
        minHeight: '300px',
        maxHeight: 'auto',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        overflowY: 'scroll'
    },
});
const StyledDialog = withStyles(styles)(Dialog);
const useStyles = makeStyles((theme) => ({
    squareAvatar: {
      width: theme.spacing(7),
      height: theme.spacing(7),
      borderRadius: 0,
    },
}));
const theme = createTheme({
    palette: {
        primary: {
            main: '#dd9d46',
        },
        secondary: {
            main: '#a44704',
        }
    },
    overrides: {
        MuiFormLabel: {
            asterisk: {
                color: '#db3131',
                '&$error': {
                color: '#db3131'
                },
            }
        }
    }
});
function getRandomColor() {
    const colors = ['#FFA600', '#fff2bf', '#ffe480', '#a2332a' , '#E74C3C' , '#690000' , '#595959', '#3e3e3e' , '#C6C6C6', '#ABABAB', '#B9B9B9'];
    return colors[Math.floor(Math.random() * colors.length)];
}
function EditRestaurant(props){
    const class_avatar = useStyles();
    const { value, defaultCountry, onChange, classes } = props;
    const [fullname, setFullname] = useState('');
    const [fullnameError, setFullnameError] = useState(false);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const openButton = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };   
    const [doe, setDoe] = useState(null);
    const [color, setColor] = useState(localStorage.getItem('avatarColor') || getRandomColor());
    const [discount, setDiscount] = useState('');
    const [update, setUpdate] = useState('');
    const [phone, setPhone] = useState('');
    const token = localStorage.getItem('token');
    const id = localStorage.getItem('id');
    const [data, setData] = useState('');
    const [city, setCity] = useState();
    const [country, setCountry] = useState('');
    const [address, setAddress] = useState(' ');
    const [description, setDescription] = useState(" ");
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newPasswordError, setNewPasswordError] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState(false);
    const [newPasswordMatch, setNewPasswordMatch] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('');
    const [show, setShow] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [profileImg, setProfileImg] = useState('');
    const MAX_FILE_SIZE = 5 * 1024 * 1024;
    const [open, setOpen] = useState(false);
    const [validInputs, setValidInputs] = useState(false);
    const [openMenu, setOpenMenu] = useState(true);
    const [idFood, setIdFood] = useState();
    const idM = localStorage.getItem('id');
    const {idR} = useParams();
    const [food, setFood] = useState([]);
    const [foodName, setFoodName] = useState('');
    const [foodNameError, setFoodNameError] = useState(false);
    const [foodPicture, setFoodPicture] = useState('');
    const [foodIngredient, setFoodIngredient] = useState('');
    const [foodIngredientError, setFoodIngredientError] = useState(false);
    const [remainFood, setRemainFood] = useState(0);
    const [remainFoodError, setRemainFoodError] = useState(false);
    const [foodPrice, setFoodPrice] = useState(0);
    const [foodPriceError, setFoodPriceError] = useState(false);
    const [menu, setMenu] = useState([]);
    const [openEdit, setOpenEdit] = useState(false);
    const [openAdd, setOpenAdd] = useState(false);
    const [updateFoodPic, setUpdateFoodPic] = useState('');
    const [countries, setCountries] = useState([]);
    const [cities, setCities] = useState();
    const [lat, setLat] = useState();
    const [lng, setLng] = useState();
    let role = localStorage.getItem("role");
    role = role.replace(/"/g, "");
    const mylocation = [lat, lng, idR, role];

    const handleFullname = (e) => {
        setFullname(e.target.value);
        setUpdate({...update, name: e.target.value})
        if(e.target.value.length > 256){
            setFullnameError(true);
        } else {
            setFullnameError(false);
        }
    };

    useEffect(() => {
        if(!localStorage.getItem('avatarColor')) {
            localStorage.setItem('avatarColor', color);
        }
    }, []);

    const handleReloadPage = () => {
        window.location.reload();
    };

    useEffect(() => {
        if(alertMessage !== "" && alertSeverity !== ""){
            if(alertSeverity === "success"){
                toast.success(alertMessage, {
                            position: toast.POSITION.BOTTOM_LEFT,
                            title: "Success",
                            autoClose: 7000,
                            pauseOnHover: true,
                            onClose: handleReloadPage
                        });
            } else {
                toast.error(alertMessage, {
                            position: toast.POSITION.BOTTOM_LEFT,
                            title: "Error",
                            autoClose: 3000,
                            pauseOnHover: true
                        });
            }
            setAlertMessage("");
            setAlertSeverity("");
        }
    }, [alertMessage, alertSeverity]);

    useEffect(() => {
        localStorage.setItem('lat', lat);
        localStorage.setItem('long', lng);
    }, [lat,lng])

    const handlePhoneChange = (value) => {
        setUpdate({...update, number : value});
        localStorage.setItem('phone', value);
        setPhone(value);
    };

    const handleEstablishdate = (date) => {
        setDoe(date);
        console.log(data.date_of_establishment);
        const formattedDate = dayjs(date).format('YYYY-MM-DD');
        setUpdate({...update, date_of_establishment : formattedDate});
    };

    const handleDiscount = (e) => {
        setDiscount(e.target.value);
        setUpdate({...update, discount: e.target.value/100});
    };

    const handleOpenMenu = () => {
        setOpenMenu(!openMenu);
        axios.get(
            `http://5.34.195.16/restaurant/managers/${idM}/restaurants/${idR}/food/` , 
            {headers :{
                'Content-Type' : 'application/json',
                "Access-Control-Allow-Origin" : "*",
                "Access-Control-Allow-Methods" : "GET,POST",
                'Authorization' : "Token " + token.slice(1,-1)
            }}
        )
        .then((response) => {
            console.log(response);
            setMenu(response.data);
        })
        .catch((error) => console.log(error));
    };

    useEffect(() =>{
        axios.get(
            `http://5.34.195.16/user/all-countries/` , 
            {headers :{
                'Content-Type' : 'application/json'
            }}
        )
        .then((response) => {
            setCountries(response.data);
            console.log("ALL countries are here!");
        })
        .catch((error) => console.log(error));
    },[]);

    useEffect(() =>{
        axios.get(
            `http://5.34.195.16/restaurant/${idR}/lat_long` , 
            {headers :{
                'Content-Type' : 'application/json',
                "Access-Control-Allow-Origin" : "*",
                "Access-Control-Allow-Methods" : "GET,POST",
                'Authorization' : "Token " + token.slice(1,-1)
            }}
        )
        .then((response) => {
            console.log("got Lat and Lng!");
            const data = response.data;
            console.log(data);
            setLat(data.lat);
            setLng(data.lon);

        })
        .catch((error) => console.log(error));
    },[]);

    useEffect(() =>{
        const userData = {
            name: country
        };
        console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
        console.log(userData);
        axios.post("http://5.34.195.16/user/cities-of-country/", userData, {headers:{"Content-Type" : "application/json"}})
        .then((response) => {
            console.log("Here to add cities");
            console.log(response);
            setCities(response.data);
        })
        .catch((error) => console.log(error));
    },[country]);

    const handleCity = (e) => {
        console.log("line 286");
        console.log(e.target.value);
        setCity(e.target.value);
    };

    const handleCountry = (e) => {
        setCountry(e.target.value);
    };

    const handleAddress = (e) => {
        setAddress(e.target.value);
    };

    const handleDescription = (e) => {
        setDescription(e.target.value);
        setUpdate({...update, description : e.target.value});
    };

    useEffect(() => {
        setNewPasswordMatch(newPassword === confirmPassword);
    }, [newPassword, confirmPassword]);

    useEffect(() => {
        setFullname(data.name);
    }, [data.name]);

    useEffect(() => {
        setDoe(data.date_of_establishment);
    }, [data.date_of_establishment]);

    useEffect(() => {
        setProfileImg(data.restaurant_image);
    },[data.restaurant_image]);

    useEffect(() => {
        setDiscount(data.discount * 100);
    }, [data.discount]);

    useEffect(() => {
        setDescription(data.description);
    }, [data.description]);

    useEffect(() => {
        console.log("addreess is : ");
        console.log(data.address);
        const arr = data?.address?data?.address.split(","):[];
        console.log(arr[1]);
        setCountry(arr[2] || '');
        setAddress(arr[0] || '');
    }, [data.address]);

    useEffect(() => {
        const temp = address + ',' + city + ',' + country;
        console.log("city is : ");
        console.log(city);
        console.log(temp);
        setUpdate({...update, address : temp})
    }, [country, city, address]);
    useEffect(() => {
        console.log("line 346"); 
        const arr = data?.address?data?.address.split(",") : "";
        console.log("City is: ", arr[1]);
        setCity(arr[1] || "");
    }, [data]);
    useEffect(() => {
        setFoodName(food.name);
    }, [food.name]);

    useEffect(() => {
        setFoodPrice(food.price);
    }, [food.price]);

    useEffect(() => {
        setFoodIngredient(food.ingredients);
    }, [food.ingredients]);

    useEffect(() => {
        setRemainFood(food.remainder);
    }, [food.remainder]);
    useEffect(() => {
        setFoodPicture(food.food_pic);
    }, [food.food_pic]);

    const history = useHistory();
    const handleClose = () => {
        setOpen(false);
    };

    const handleProfileImg = (e) => {
        const file = e.target.files[0];
        const fileSize = file.size;
        if(fileSize > MAX_FILE_SIZE){
            setOpen(true);
            e.target.value = null;
            setProfileImg(null);
            return;
        } else{
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => {
                setProfileImg(reader.result);
                console.log("Dsafsfa");
                setUpdate({...update, restaurant_image: reader.result});
            };
        }
    };
    const handleFoodPicture = (e) => {
        const file1 = e.target.files[0];
        const fileSize1 = file1.size;
        if(fileSize1 > MAX_FILE_SIZE){
            e.target.value = null;
            setFoodPicture(null);
            return;
        } else{
            const reader1 = new FileReader();
            reader1.readAsDataURL(file1);
            reader1.onloadend = () => {
                setFoodPicture(reader1.result);
                setUpdateFoodPic({...updateFoodPic, food_pic: reader1.result});
            };
        }
    };
    useEffect(()=> {
        setFoodPicture(updateFoodPic.food_pic);
    }, [updateFoodPic]);
    useEffect(() => {
        setFoodName('');
        setFoodIngredient('');
        setFoodPrice('');
        setRemainFood('');
        setFoodPicture('');
    }, [openAdd]);
    const handleFoodName = (e) => {
        setFoodName(e.target.value);
        if(e.target.value.length > 255){
            setFoodNameError(true);
        } else {
            setFoodNameError(false);
        }
    };

    const handleFoodIngredient = (e) => {
        setFoodIngredient(e.target.value);
        if(e.target.value.length > 256){
            setFoodIngredientError(true);
        } else {
            setFoodIngredientError(false);
        }
    };

    const handleRemain = (e) => {
        setRemainFood(e.target.value);
        console.log("the updated value is  : "+e.target.value);
        console.log("remail here is : " + remainFood);
        if(!/^[0-9]+?$/.test(e.target.value) || e.target.value.trim() === ''){
            setRemainFoodError(true);
        } else {
            setRemainFoodError(false);
        }
    };

    const handleFoodPrice = (e) => {
        setFoodPrice(e.target.value);
        if(!/^[0-9]+([.][0-9]+)?$/.test(e.target.value) || e.target.value.trim() === ''){
            setFoodPriceError(true);
        } else {
            setFoodPriceError(false);
        }
    };
    
    useEffect(() => {
        let valid = !fullnameError && !newPasswordError && newPasswordMatch
        setValidInputs(valid);
    }, [fullnameError, password, newPasswordError, confirmPasswordError, newPasswordMatch]);

    const handleBackButton = () => {
        history.push("/homepage-restaurant");
    }

    useEffect(() =>{
        axios.get(
            `http://5.34.195.16/restaurant/managers/${idM}/restaurants/${idR}/` , 
            {headers :{
                'Content-Type' : 'application/json',
                "Access-Control-Allow-Origin" : "*",
                "Access-Control-Allow-Methods" : "GET,PATCH,PUT,DELETE",
                'Authorization' : "Token " + token.slice(1,-1)
            }}
        )
        .then((response) => {
            console.log(response);
            setData(response.data)
        })
        .catch((error) => console.log(error));
    },[]);

    const firstChar = data?.name?data.name.charAt(0) : "UN";
    const handleUpdate = (e) => {
        e.preventDefault();
        axios.patch(
            `http://5.34.195.16/restaurant/managers/${idM}/restaurants/${idR}/`, update,
            {headers: {
                'Content-Type' : 'application/json',
                "Access-Control-Allow-Origin" : "*",
                "Access-Control-Allow-Methods" : "GET,PATCH",
                'Authorization' : "Token " + token.slice(1,-1)   
            }}
        )
        .then((response)=> {
            console.log(response);
            console.log("succesfully updated");
            setAlertMessage("Restaurant details updated successfully!");
            setAlertSeverity("success");
        })
        .catch((error) => {
            console.log(error)
            if (error.request) {
                setAlertMessage("Network error! Please try again later.");
                setAlertSeverity("error");
            } else{
                setAlertMessage("A problem has been occured! Please try again later.");
                setAlertSeverity("error");
            }
        });
    };

    const handleDiscard = () => {
        window.location.reload(false);
    };

    const handleDeleteRestaurant = () => {
        console.log("i'm here to delete this restaurant.");
        axios.delete(`http://5.34.195.16/restaurant/managers/${idM}/restaurants/${idR}/`)
        .then((response) => {
            history.push("/homepage-restaurant");
        })
        .catch((error) => console.log(error));
    }

    const handleDelete = (res) => {
        console.log("i'm here to delete.");
        axios.delete(`http://5.34.195.16/restaurant/managers/${idM}/restaurants/${idR}/food/${idFood}/`, 
            {headers: {
                'Content-Type' : 'application/json',
                "Access-Control-Allow-Origin" : "*",
                "Access-Control-Allow-Methods" : "GET,PATCH",
                'Authorization' : "Token " + token.slice(1,-1)   
            }}
        )
        .then((response) => {
            setAlertMessage("Food deleted successfully!");
            setAlertSeverity("success");
        })
        .catch((error) => {
            setAlertMessage("A problem has been occured! Please try again later.");
            setAlertSeverity("error");
            console.log(error);
        });
    };

    const handleOpenEdit = (e) => {
        setIdFood(e);
        setOpenEdit(!openEdit);
        axios.get(`http://5.34.195.16/restaurant/managers/${idM}/restaurants/${idR}/food/${e}/`,
            {headers: {
                'Content-Type' : 'application/json',
                "Access-Control-Allow-Origin" : "*",
                "Access-Control-Allow-Methods" : "GET,PATCH",
                'Authorization' : "Token " + token.slice(1,-1)   
            }}
        )
        .then((response) => {
            console.log(response);
            console.log("gives the food!");
            setFood(response.data);
        })
        .catch((error) => {
            console.log(error);
        });
    };

    const handleEditThisFood = () => {
        const editData = {
            id: idFood,
            name: foodName, 
            price: foodPrice, 
            ingredients: foodIngredient, 
            food_pic: foodPicture,
            remainder: remainFood,
            restaurant_id: idR
        }
        console.log('im here to edit');
        console.log(editData);
        console.log(idFood);
        axios.put(`http://5.34.195.16/restaurant/managers/${idM}/restaurants/${idR}/food/${idFood}/`, editData,
            {headers: {
                'Content-Type' : 'application/json',
                "Access-Control-Allow-Origin" : "*",
                "Access-Control-Allow-Methods" : "GET,PATCH",
                'Authorization' : "Token " + token.slice(1,-1)   
            }}
        )
        .then((response) => {
            console.log(response);
            setAlertMessage("Food updated successfully!");
            setAlertSeverity("success");
        })
        .catch((error) => {
            setAlertMessage("A problem has been occured! Please try again later.");
            setAlertSeverity("error");
            console.log(error);
        });
    };

    const hanldeAddNewFood = (e) => {
        e.preventDefault();
        const userData = {
            name: foodName,
            price: foodPrice,
            ingredients: foodIngredient,
            food_pic: foodPicture,
            remainder: remainFood,
            restaurant_id: idR
        };
        console.log(userData);
        axios.post(`http://5.34.195.16/restaurant/managers/${idM}/restaurants/${idR}/food/`, userData, {headers:{"Content-Type" : "application/json", 'Authorization' : "Token " + token.slice(1,-1)}})
        .then((response) => {
            console.log(response);
            setAlertMessage("Food added successfully!");
            setAlertSeverity("success");
        })
        .catch((error) => {
            if (error.response) {
                console.log(error.response);
                console.log("server responded");
                setAlertMessage("A problem has been occured! Please try again later.");
                setAlertSeverity("error");
            } 
            else if (error.request) {
                console.log("network error");
                console.log(error);
                setAlertMessage("Network error! Please try again later.");
                setAlertSeverity("error");
            } 
            else {
                console.log(error);
                setAlertMessage("A problem has been occured! Please try again later.");
                setAlertSeverity("error");
            }
        });
    };

    const handleOpenAdd = (e) => {
        setOpenAdd(!openAdd);
    };
    const [showMap, setShowMap] = useState(false);
    const [blurBackground, setBlurBackground] = useState(false);
    
    const handleOpenMap = () => {
        setShowMap(true);
        setBlurBackground(true);
      };
          
    const handleCloseMap = () => {
        setShowMap(false);
        setBlurBackground(false);
    };

    return ( 
        <ThemeProvider theme={theme}>
            <div className="edit-back-restaurant">
                <HeaderRestaurant/>
                <div className={`container ${blurBackground ? 'blur-background' : ''}`}>
                    <div >
                        <ToastContainer />
                    </div>
                    <Grid container spacing={2} className="edit-grid-restaurant">
                        <Grid item md={3} sm={12} xs={12}>
                            <Box className="edit-box-restaurant">
                                <Typography variant="h5" 
                                    color="textPrimary"
                                    gutterBottom
                                    className="edit-title-restaurant"
                                >
                                    Profile Picture
                                </Typography>
                                <Avatar
                                    className="edit-avatar-restaurant"
                                    style={{backgroundColor: color, fontSize:"40px"}}
                                    src={profileImg}
                                >
                                    {firstChar}
                                </Avatar>
                                <Typography className="text-above-upload-restaurant">
                                    JPG or PNG no larger than 5 MB
                                </Typography>
                                {open && <Alert severity="error" open={open} onClose={handleClose} className="image-alert-restaurant" variant="outlined" >
                                            File size is too large.
                                        </Alert>
                                }
                                <input
                                    accept="image/*"
                                    id="profile-image-input"
                                    type="file"
                                    onChange={handleProfileImg}
                                    hidden      
                                    MAX_FILE_SIZE={MAX_FILE_SIZE}                   
                                />
                                <label htmlFor="profile-image-input" className="input-label-restaurant">
                                    <Button className="upload-button-restaurant"  component="span">
                                        Upload new image
                                    </Button>
                                </label>
                            </Box>
                        </Grid>
                        <Grid item md={9} sm={12} xs={12}>
                            <Box className="edit-box-restaurant">
                                <Typography variant="h5" 
                                    color="textPrimary"
                                    gutterBottom
                                    className="edit-title-restaurant"
                                >
                                    Restaurant Details 
                                </Typography>
                                <FormControl className="edit-field-restaurant">
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6} md={6}>
                                            <TextField
                                                label="Restaurant name"
                                                variant="outlined"
                                                color="secondary"
                                                value={fullname}
                                                onChange={handleFullname}
                                                style={{width: '100%'}}
                                                error={fullnameError}
                                                InputLabelProps={{ shrink: true }} 
                                                helperText={
                                                    <div className="edit-error-restaurant">
                                                        {fullnameError && 'Name should have at most 256 characters.'}
                                                    </div>
                                                }
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={6}>
                                            <PhoneInput
                                                label="Phone number"
                                                value={data.number}
                                                defaultCountry="ir"
                                                color="secondary"
                                                onChange={handlePhoneChange}
                                                InputLabelProps={{ shrink: true }} 
                                                className="phone-input-restaurant"
                                                style={{width: '100%'}}
                                                variant="outlined"
                                                inputProps={{
                                                    maxLength: 13
                                                }}
                                            />
                                        </Grid>
                                    </Grid>
                                </FormControl>
                                <FormControl className="edit-field-restaurant">
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6} md={6} lg={6}>
                                            <LocalizationProvider dateAdapter={AdapterDayjs} style={{width: '150%'}}
                                                InputLabelProps={{ shrink: true }}
                                            >
                                                <DemoContainer components={['DatePicker']} >
                                                    <DatePicker
                                                        label="Establishment date"
                                                        views={['year', 'month', 'day']}
                                                        sx={{width: '100%'}}
                                                        maxDate={dayjs()}
                                                        onChange={handleEstablishdate}
                                                        value={doe ? dayjs(doe) : null }
                                                    />
                                                </DemoContainer>
                                            </LocalizationProvider>
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={6} lg={6}>
                                            <TextField
                                                label="Discount"
                                                variant="outlined"
                                                color="secondary"
                                                value={discount}
                                                onChange={handleDiscount}
                                                InputLabelProps={{ shrink: true }}  
                                                style={{width: '100%', marginTop: '8px'}}
                                            />
                                        </Grid>
                                    </Grid>
                                </FormControl>
                                <FormControl className="edit-field-restaurant">
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6} md={6}>
                                            <TextField
                                                label="Country"
                                                variant="outlined"
                                                color="secondary"
                                                value={country}
                                                InputLabelProps={{ shrink: true }}
                                                style={{width: '100%'}}
                                                onChange={handleCountry}
                                                select
                                                SelectProps={{
                                                    MenuProps: {
                                                    PaperProps: {
                                                        style: {
                                                        maxHeight: '290px', 
                                                        },
                                                    },
                                                    },
                                                }}
                                            >
                                                <MenuItem value="select" disabled>
                                                    <em>Select Country</em>
                                                </MenuItem>
                                                {countries && countries.map((c, index) => (
                                                    <MenuItem style={{height: '40px' }} value={c}>{c}</MenuItem>
                                                ))} 
                                            </TextField>
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={6}>
                                            <TextField
                                                label="City"
                                                variant="outlined"
                                                color="secondary"
                                                value={city}
                                                InputLabelProps={{ shrink: true }}
                                                style={{width: '100%'}}
                                                onChange={handleCity}
                                                select
                                                SelectProps={{
                                                    MenuProps: {
                                                    PaperProps: {
                                                        style: {
                                                        maxHeight: '290px', 
                                                        },
                                                    },
                                                    },
                                                }}
                                            > 
                                                <MenuItem value="select" disabled>
                                                    <em>Select City</em>
                                                </MenuItem>
                                                {cities && cities.map((c, index) => (
                                                    <MenuItem style={{height: '40px' }} value={c}>{c}</MenuItem>
                                                ))}
                                            </TextField>
                                        </Grid>
                                    </Grid>
                                </FormControl>
                                <FormControl className="edit-field-restaurant">
                                    <TextField
                                        label="Address"
                                        variant="outlined"
                                        color="secondary"
                                        multiline
                                        value = {address?address:""}
                                        onChange={handleAddress}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton title="choose location" style={{marginLeft:"28%"}} onClick={handleOpenMap}>
                                                        <TravelExploreIcon />
                                                    </IconButton>
                                                </InputAdornment>
                                            )
                                        }}
                                    />
                                    <Modal open={showMap} onClose={handleCloseMap}>
                                        <Map location = {mylocation}/>
                                    </Modal>
                                </FormControl>
                                <FormControl className="edit-field-restaurant">
                                    <TextField
                                        label="Description"
                                        variant="outlined"
                                        color="secondary"
                                        multiline
                                        value = {description}
                                        onChange={handleDescription}
                                        InputLabelProps={{ shrink: true }}  
                                    />
                                </FormControl>

                                <FormControl className="edit-field-restaurant">
                                    {openMenu && 
                                        <Button 
                                            color="secondary"
                                            onClick={handleOpenMenu}
                                            className="showmenu-button"
                                        >
                                            Show Menu
                                        </Button>
                                    }
                                    {!openMenu && 
                                        <div style={{margin: '5px'}}>
                                            <Grid container spacing={1} style={{justifyContent: 'flex-end', padding: '1px'}}
                                            >
                                                <IconButton title="Add food">
                                                    <AddIcon style={{color: 'green'}} onClick={handleOpenAdd}/>
                                                </IconButton>
                                                <IconButton title="Hide menu" >
                                                    <ClearIcon style={{color: 'red'}} onClick={handleOpenMenu}/>
                                                </IconButton>
                                            </Grid>
                                            <StyledDialog open={openAdd} classes={{ paper: classes.dialogRoot }} onClose={handleOpenAdd}>
                                                <DialogTitle className="dialog-title">Add Food</DialogTitle>
                                                <FormControl>
                                                    <Avatar
                                                        style={{backgroundColor: color, fontSize: "40px", width: "200px", height: "150px", borderRadius: "5px" }}
                                                        src={foodPicture}
                                                    >
                                                        F
                                                    </Avatar>
                                                    <input
                                                        accept="image/*"
                                                        id="food-image-input"
                                                        type="file"
                                                        onChange={handleFoodPicture}
                                                        hidden      
                                                        MAX_FILE_SIZE={MAX_FILE_SIZE}                   
                                                    />
                                                    <label htmlFor="food-image-input" className="food-image-button">
                                                        <Button className="upload-button-restaurant"  component="span">
                                                            Upload food image
                                                        </Button>
                                                    </label>
                                                </FormControl>
                                                <FormControl className="edit-field-restaurant">
                                                    <TextField
                                                        label="Name"
                                                        variant="outlined"
                                                        color="secondary"
                                                        required
                                                        value={foodName}
                                                        onChange={handleFoodName}
                                                        error={foodNameError}
                                                        helperText={
                                                            <div className="edit-error-restaurant">
                                                                {foodNameError && "Name should have at most 256 character."}
                                                            </div>
                                                        }
                                                    />
                                                </FormControl>
                                                <FormControl className="edit-field-restaurant">
                                                    <TextField
                                                        label="Ingredient"
                                                        variant="outlined"
                                                        color="secondary"
                                                        multiline
                                                        onChange={handleFoodIngredient}
                                                        error={foodIngredientError}
                                                        helperText={
                                                            <div className="edit-error-restaurant">
                                                                {foodIngredientError && "Ingredients should have at most 256 character."}
                                                            </div>
                                                        }
                                                    />
                                                </FormControl>
                                                <FormControl className="edit-field-restaurant">    
                                                    <Grid container spacing={2}>
                                                        <Grid item lg={6} md={6} sm={12}>
                                                            <TextField
                                                                label="Remain amount"
                                                                variant="outlined"
                                                                color="secondary"
                                                                value={remainFood}
                                                                required
                                                                style={{width: '100%'}}
                                                                onChange={handleRemain}
                                                                error={remainFoodError}
                                                                helperText={
                                                                    <div className="edit-error-restaurant">
                                                                        {remainFoodError && "Remain amount must be number."}
                                                                    </div>
                                                                }
                                                                InputLabelProps={{ shrink: true }}
                                                            >
                                                            </TextField>
                                                        </Grid>
                                                        <Grid item lg={6} md={6} sm={12}>
                                                            <TextField
                                                                label="Price"
                                                                variant="outlined"
                                                                color="secondary"
                                                                required
                                                                value={foodPrice}
                                                                error={foodPriceError}
                                                                onChange={handleFoodPrice}
                                                                helperText={
                                                                    <div className="edit-error-restaurant">
                                                                        {foodPriceError && "Price must be a number."}
                                                                    </div>
                                                                }
                                                                style={{width: '100%'}}
                                                                InputProps={{
                                                                    startAdornment: (
                                                                        <InputAdornment position="start" style={{marginTop:"-3px"}}>$</InputAdornment>
                                                                    ),
                                                                }}
                                                            />
                                                        </Grid>
                                                    </Grid>
                                                </FormControl>
                                                <Grid container spacing={2} className="edit-button-grid-restaurant">
                                                    <Grid item>
                                                        <Button 
                                                            className="edit-discard-button-restaurant" 
                                                            id="edit-button-restaurant" 
                                                            variant="contained"
                                                            onClick={handleOpenAdd}
                                                        >
                                                            Cancel
                                                        </Button>
                                                    </Grid>
                                                    <Grid item lg={2} md={2} sm={2} justifyContent="flex-end">
                                                        <Button 
                                                            className="edit-save-changepass-button-restaurant" 
                                                            id="edit-button-restaurant" 
                                                            variant="contained" 
                                                            style={{width: 'auto'}}
                                                            onClick={hanldeAddNewFood}
                                                        >
                                                            Add
                                                        </Button>
                                                    </Grid>
                                                </Grid>
                                            </StyledDialog>
                                            <Box className="menu-box">
                                                {menu && menu.map((res, index) => (
                                                    <div>
                                                        <Box className="food-box">
                                                            <Grid container spacing={3}>
                                                                <Grid item lg={2} md={2} sm={2} className="food">
                                                                    <img src={res.food_pic} className="food-image"/>
                                                                </Grid>
                                                                <Grid item lg={5} md={5} sm={6}>
                                                                    <Typography className="food-name">
                                                                        {res.name}
                                                                    </Typography>
                                                                    <Typography className="food-ingredient">
                                                                        {res.ingredients}
                                                                    </Typography>
                                                                </Grid>
                                                                <Grid item lg={2} md={1} sm={1}>
                                                                    <Typography className="food-type-price">
                                                                        {res.type}
                                                                    </Typography>
                                                                </Grid>
                                                                <Grid item lg={1} md={1} sm={1}>
                                                                    <Typography className="food-type-price">
                                                                        {res.price}$
                                                                    </Typography>
                                                                </Grid>
                                                                <Grid item lg={2} md={3} sm={2}>
                                                                    <Button className="food-edit" id="food-edit-button" onClick={() => handleOpenEdit(res.id)}>
                                                                        Edit
                                                                    </Button>
                                                                </Grid>
                                                            </Grid>
                                                        </Box>
                                                        <StyledDialog open={openEdit} classes={{ paper: classes.dialogRoot }} onClose={handleOpenEdit}>
                                                            <DialogTitle  className="dialog-title">Edit Food</DialogTitle>
                                                            <FormControl>
                                                                <Avatar
                                                                    style={{backgroundColor: color, fontSize: "40px", width: "200px", height: "150px", borderRadius: "5px" }}
                                                                    src={foodPicture}
                                                                >
                                                                    F
                                                                </Avatar>
                                                                <input
                                                                    accept="image/*"
                                                                    id="edit-food-image-input"
                                                                    type="file"
                                                                    onChange={handleFoodPicture}
                                                                    hidden      
                                                                    MAX_FILE_SIZE={MAX_FILE_SIZE}                   
                                                                />
                                                                <label htmlFor="edit-food-image-input" className="food-image-button">
                                                                    <Button className="upload-button-restaurant"  component="span">
                                                                        Upload food image
                                                                    </Button>
                                                                </label>
                                                            </FormControl>
                                                            <FormControl className="edit-field-restaurant">
                                                                <TextField
                                                                    label="Name"
                                                                    variant="outlined"
                                                                    color="secondary"
                                                                    value={foodName}
                                                                    required
                                                                    onChange={handleFoodName}
                                                                    error={foodNameError}
                                                                    helperText={
                                                                        <div className="edit-error-restaurant">
                                                                            {foodNameError && "Name should have at most 256 character."}
                                                                        </div>
                                                                    }
                                                                    InputLabelProps={{ shrink: true }}
                                                                />
                                                            </FormControl>
                                                            <FormControl className="edit-field-restaurant">
                                                                <TextField
                                                                    label="Ingredient"
                                                                    variant="outlined"
                                                                    color="secondary"
                                                                    value={foodIngredient}
                                                                    multiline
                                                                    onChange={handleFoodIngredient}
                                                                    error={foodIngredientError}
                                                                    helperText={
                                                                        <div className="edit-error-restaurant">
                                                                            {foodIngredientError && "Ingredients should have at most 256 character."}
                                                                        </div>
                                                                    }
                                                                    InputLabelProps={{ shrink: true }}
                                                                />
                                                            </FormControl>
                                                            <FormControl className="edit-field-restaurant">    
                                                                <Grid container spacing={2}>
                                                                    <Grid item lg={6} md={6} sm={12}>
                                                                        <TextField
                                                                            label="Remain amount"
                                                                            variant="outlined"
                                                                            color="secondary"
                                                                            value={remainFood}
                                                                            required
                                                                            style={{width: '100%'}}
                                                                            onChange={handleRemain}
                                                                            error={remainFoodError}
                                                                            helperText={
                                                                                <div className="edit-error-restaurant">
                                                                                    {remainFoodError && "Remain amount must be number."}
                                                                                </div>
                                                                            }
                                                                            InputLabelProps={{ shrink: true }}
                                                                        >
                                                                        </TextField>
                                                                    </Grid>
                                                                    <Grid item lg={6} md={6} sm={12}>
                                                                        <TextField
                                                                            label="Price"
                                                                            variant="outlined"
                                                                            color="secondary"
                                                                            onChange={handleFoodPrice}
                                                                            value={foodPrice}
                                                                            required
                                                                            style={{width: '100%'}}
                                                                            InputProps={{
                                                                                startAdornment: (
                                                                                    <InputAdornment position="end" style={{marginTop: '-2px'}}>$</InputAdornment>
                                                                                ),
                                                                            }}
                                                                        />
                                                                    </Grid>
                                                                </Grid>
                                                            </FormControl>
                                                            <Grid container spacing={2} className="edit-button-grid-restaurant">
                                                                <Grid item>
                                                                    <Button 
                                                                        className="edit-discard-button-restaurant" 
                                                                        id="edit-button-restaurant" 
                                                                        variant="contained"
                                                                        onClick={handleDelete}
                                                                    >
                                                                        Delete
                                                                    </Button>
                                                                </Grid>
                                                                <Grid item container lg={6} md={6} sm={8} justifyContent="flex-end">
                                                                    <Grid item style={{paddingRight: '5px'}}>
                                                                        <Button 
                                                                            className="edit-discard-button-restaurant" 
                                                                            id="edit-button-restaurant" 
                                                                            variant="contained"
                                                                            onClick={handleOpenEdit}
                                                                        >
                                                                            Cancel
                                                                        </Button>
                                                                    </Grid>
                                                                    <Grid item>
                                                                        <Button 
                                                                            className="edit-save-changepass-button-restaurant" 
                                                                            id="edit-button-restaurant" 
                                                                            variant="contained" 
                                                                            style={{width: 'auto'}}
                                                                            onClick={() => handleEditThisFood()}
                                                                        >
                                                                            Apply
                                                                        </Button>
                                                                    </Grid>
                                                                </Grid>
                                                            </Grid>
                                                        </StyledDialog>
                                                    </div>
                                                ))}
                                            </Box>
                                        </div>
                                    }
                                </FormControl>
                                <Grid container spacing={2} className="edit-button-grid-restaurant" wrap="nowrap">
                                    <Grid item>
                                        <Button 
                                            className="edit-discard-button-restaurant" 
                                            id="edit-button-restaurant" 
                                            variant="contained" 
                                            onClick={handleDeleteRestaurant}
                                        >
                                            Delete restaurant
                                        </Button>              
                                                    
                                    </Grid>  
                                    <Grid item container lg={5} md={6} sm={12} justifyContent="flex-end">
                                        <Grid item style={{paddingRight: '5px'}}>
                                            <Button 
                                                className="edit-discard-button-restaurant" 
                                                id="edit-button-restaurant" 
                                                variant="contained" 
                                                onClick={handleDiscard}
                                            >
                                                Discard
                                            </Button>
                                        </Grid>
                                        <Grid item>
                                            <Button 
                                                className="edit-save-changepass-button-restaurant" 
                                                id="edit-button-restaurant" 
                                                variant="contained" 
                                                onClick={handleUpdate}
                                                disabled={!validInputs}
                                            >
                                                Save changes
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Grid>

                            </Box>
                        </Grid>
                    </Grid> 
                </div>
                <Footer/>
            </div>
        </ThemeProvider>
    );
}

export default withStyles(styles)(EditRestaurant);