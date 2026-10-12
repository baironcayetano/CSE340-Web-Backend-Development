/**
 * Deletes the toasts notifications after been seen for 1.5 minutes
 * @param {Array<HTMLParagraphElement>} alerts 
 * @param {HTMLDivElement} toastContainer
 * @returns {void}
 */
export default function deleteToasts(alerts, toastContainer){
   if(!alerts || alerts.length <= 0) return 

   setTimeout(()=>{
      toastContainer.remove();
   }, 6000) //deletes all alerts after 1 minute
}