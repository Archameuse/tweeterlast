export default function monthName(month:number):string {
    if(month > 11) month = 11
    if(month < 0) month = 0
    const monthNames = [
        "January", 
        "February", 
        "March", 
        "April", 
        "May", 
        "June",
        "July", 
        "August", 
        "September", 
        "October", 
        "November", 
        "December"
        ];
    return monthNames[Math.floor(month)]
}