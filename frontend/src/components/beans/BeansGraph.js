import React from "react";
import moment from 'moment';

const BeansGraph = ({beans}) => {
    const graphItems = [];

    console.log("inside BeansGraph")
    // {beans} - array of beans related to current user 

    // we need to go through all the elements and check if completed = true;  
    //then we check the date of complted bean  and it is 
    //createdDate (LocalDate) (maybe user has completed this task next day but for simplification, I propose 
    //to use creation date as completion date)
    //if it is a new date, need to assing 1 to score and got next with the element in the loop
    //If the date is the same, for the current day we need to add +1 to beanscore 

    //Date is in LocalDate, we need to convert the date to range (1-365)
    // moment library should help 

    // change value here to map with data
        
    // const data = [{
    //     day: 1,
    //     bean: 1
    // , {
    //     day: 2,
    //     bean: 2
    // }, {
    //     day: 365,
    //     bean: 3
    // }];
    // const graphItems = data.map((item) => <li data-level={item.bean}></li>)

    {beans.sort((a, b) => b.id - a.id).map(bean => (
       console.log(moment(bean.createdDate).format("DDD")) //350th day for todays date 
       //graphItems.push(<li data-level={10} key={moment(bean.createdDate).format("DDD")} />)
    ))} 

    
   for (var i = 1; i < 365; i++) {
        const level = Math.floor(Math.random() * 3);
        graphItems.push(<li data-level={level} key={i} />);
    } 

    return (
        <div className="graph">
            <ul className="months">
                <li>Jan</li>
                <li>Feb</li>
                <li>Mar</li>
                <li>Apr</li>
                <li>May</li>
                <li>Jun</li>
                <li>Jul</li>
                <li>Aug</li>
                <li>Sep</li>
                <li>Oct</li>
                <li>Nov</li>
                <li>Dec</li>
            </ul>
            <ul className="days">
                <li>Sun</li>
                <li>Mon</li>
                <li>Tue</li>
                <li>Wed</li>
                <li>Thu</li>
                <li>Fri</li>
                <li>Sat</li>
            </ul>
            <ul className="squares">
                {graphItems}
            </ul>
        </div>
    );
}

export default BeansGraph;