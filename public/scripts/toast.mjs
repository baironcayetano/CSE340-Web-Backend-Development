/**
 * Deletes the toasts notifications after been seen for 1.5 minutes
 * @param {Array<HTMLParagraphElement>} alerts 
 * @param {HTMLDivElement} toastContainer
 * @returns {void}
 */
export default function deleteToasts(alerts, toastContainer){
   if(!alerts || alerts.length <= 0) return 

   alerts.forEach(alert => {
       setTimeout(()=>{
          alert.remove();
       }, 9000)
   });

   setTimeout(()=>{
      toastContainer.remove();
   }, 9000 + (100 * alerts.length)) //deletes parent element after 1.5m + (1s * notification)
}