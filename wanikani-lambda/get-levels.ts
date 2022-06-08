import axios from 'axios';
import { users } from './user-data';
 
const wanikaniURL = 'https://api.wanikani.com';

// const updated_after = "";
const date = subtractHours(1);
console.log(date);
const updated_after = date.toDateString();
// const updated_after = "updated_after=2022-06-01T10:42:00Z";

async function getLevels(): Promise<number[]> {
    
    let levels = [];
    for (const user of users){
        const config = {
            headers: {
                Authorization: `Bearer ${user.readOnlyApiToken}`
            }
        };
        const response = await axios.get(`${wanikaniURL}/v2/level_progressions?${updated_after}`, config);
        // console.log(response.data.total_count);
        levels.push(response.data.total_count);
        // console.log(levels)
    }
    // console.log('tets')
    return levels;
}

function subtractHours(numOfHours: number, date = new Date()) {
    date.setHours(date.getHours() - numOfHours);
    return date;
}

async function index () {
    let x = await getLevels();
    console.log(x);
}

index();

export { getLevels };