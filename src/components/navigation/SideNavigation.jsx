import React, {useEffect} from 'react';
import {Image} from "react-bootstrap";
import logo from "../../assets/Logo-Colored.png";
import {NavLink} from "react-router-dom";

function SideNavigation({setAuth}) {

    useEffect(()=>{
        function navCollapse(){
            document.querySelector(".collapse--link").addEventListener("click", function(e){
                document.querySelector(".sidenav").classList.toggle("sidenav--collapse")
            })
        }
        navCollapse();
    },[])

    function logout() {
        setAuth(false)
        localStorage.removeItem("access")
        localStorage.removeItem("refresh")
    }

    return (
        <div className="sidenav">
            <div className="brand--logo">
                <Image src={logo} />
            </div>
            <div className="navigation--items">
                <ul className="d-flex">
                    <li className="dashboard--link"><NavLink to="/main/dashboard" className="d-flex align-items-center">Dashboard</NavLink></li>
                    <li className="portfolio--link"><NavLink to="/main/portfolio" className="d-flex align-items-center">Portfolio</NavLink></li>
                    <li className="watchlist--link"><NavLink to="/main/watchlist" className="d-flex align-items-center">Watch List</NavLink></li>
                    <li className="transactions--link"><NavLink to="/main/transactions" className="d-flex align-items-center">Transactions</NavLink></li>
                    <li className="settings--link"><NavLink to="/main/settings" className="d-flex align-items-center">Settings</NavLink></li>
                    <li className="logout--link">
                        <NavLink to="/main/logout"
                                 className="d-flex align-items-center"
                                 onClick={logout}
                        >
                            Logout
                        </NavLink>
                    </li>
                    <li className="collapse--link"><NavLink to="#" className="d-flex align-items-center">Collapse</NavLink></li>
                </ul>
            </div>
        </div>
    );
}

export default SideNavigation;
