import * as React from 'react';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import CardActionArea from '@mui/material/CardActionArea'
import { red } from '@mui/material/colors';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import RemoveShoppingCart from '@material-ui/icons/RemoveShoppingCart';
import { TextField } from '@material-ui/core';
import Collapse from '@mui/material/Collapse';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import { styled} from '@mui/material/styles';
import './Food.css';
import axios from 'axios';
import { Button } from '@material-ui/core';
import { useParams } from 'react-router-dom';
import { Chip, Divider, Grid } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useState } from 'react';
import { useEffect } from 'react';

interface ExpandMoreProps extends IconButtonProps {
    expand: boolean;
}
const ExpandMore = styled((props: ExpandMoreProps) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
    }),
}));

const userid = localStorage.getItem("id");

const Food = (props) => {
    const [count, setCount] = React.useState(0);
    const [expanded, setExpanded] = React.useState(false);
    const [restaurant, setRestaurant] = React.useState('');
    const [menu, setMenu] = React.useState([]);
    const {id} = useParams(); 
    const food = props.food;
    const token = localStorage.getItem('token');
    const order_id = localStorage.getItem("order_id");
    const resid = food.restaurant_id;
    const handleChange = (e) => {
        setCount(e.target.value);
    }     
    const [remainder, setRemainder] = React.useState('');
    React.useEffect(() => {
        if(food.remainder === 0)
            setRemainder('there is no food');
        else    
            setRemainder(food.remainder);
        
    }, []);


    const handleRemoveFromCartClick2 = () => {
        axios.get("http://5.34.195.16/restaurant/restaurant_view/"+ resid + "/" + userid + "/order/remove_from_order/" + food.id + "/",
        {headers: {
            'Content-Type' : 'application/json',
            "Access-Control-Allow-Origin" : "*",
            "Access-Control-Allow-Methods" : "PUT,PATCH",
            'Authorization' : "Token " + token.slice(1,-1)   
        }})
        .then((response) => {
            console.log("remove1");
            setRemainder(response.data.new_remainder);
        })
        .catch((error) => {
            console.log(error.response);
        });
        console.log("remove2");
        if (count > 0)
            {
                setCount(count - 1);
            }
    };  

    const handleAddToCartClick2 = () => {
        console.log("food id", food.id);
        axios.get("http://5.34.195.16/restaurant/restaurant_view/"+ resid + "/" + userid + "/order/add_to_order/" + food.id + "/",
        {headers: {
            'Content-Type' : 'application/json',
            "Access-Control-Allow-Origin" : "*",
            "Access-Control-Allow-Methods" : "PUT,PATCH",
            'Authorization' : "Token " + token.slice(1,-1)   
        }})
        .then((response) => {
            console.log("add1");
            setRemainder(response.data.new_remainder);
            
        })
        .catch((error) => {
            console.log(error.response);
        });
        console.log("add2");
        if (remainder > 0)
            {
                setCount(parseInt(count) + 1);
            }
    };  

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    React.useEffect(() => {
        localStorage.setItem('countOffood', JSON.stringify(count));
        }, [count]);

    React.useEffect(() => {

        axios.get("http://5.34.195.16/restaurant/restaurant_view/" + resid + '/',
        {headers: {
            'Content-Type' : 'application/json',
            "Access-Control-Allow-Origin" : "*",
            "Access-Control-Allow-Methods" : "PUT,PATCH",
            'Authorization' : "Token " + token.slice(1,-1) 
        }})
        .then((response) => {
            setRestaurant(response.data);
            setMenu(restaurant.menu);
        })
        .catch((error) => {
            console.log(error);
        });
    },[]);

    return ( 
        <div>
            <Card sx={{ borderRadius: 2 }} className= 'card-food'>
                <CardActionArea>
                    <CardMedia
                        component="img"
                        sx={{ height: 140 }}
                        image={food.food_pic}
                        title={food.Type}
                    />
                    <CardContent sx={{ height: 25}}>
                        <Typography gutterBottom className='food-name-restaurant-view'>{food.name}</Typography>
                        <Typography variant="body2" color="text.secondary">{food.ingredients}</Typography>
                        <Typography variant="body2" color="#ffa600">remaining: {remainder}</Typography>

                    </CardContent>
                    </CardActionArea>
                <CardActions>
                    <Grid container spacing={3.5} className='food-card-grid'>
                        <Grid item>
                            <Typography className='food-price'>${parseInt(food.price)}</Typography>
                        </Grid>
                        
                        <Grid item lg={5} md={5} sm={5} className='count-buttons'>
                            <button className='button__wrapper'  onClick={handleRemoveFromCartClick2} >-</button>
                            <h5 className="food-h5" onChange={handleChange}>{count}</h5>
                            <button className={`button__wrapper ${remainder === 'there is no food' ? 'food-disabled' : ''}`} onClick={handleAddToCartClick2} disabled={remainder === 'there is no food'}>+</button>
                        </Grid>
                    </Grid>
                </CardActions>
            </Card>
        </div>
    );
}
export default Food;