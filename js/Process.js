/**
 * Process class representing a single process in the scheduling simulation
 * @class
 */
class Process {
    /**
     * Creates a new Process instance
     * @param {string} id - Process identifier
     * @param {number} arrivalTime - Time when process arrives in the system
     * @param {number} burstTime - Total CPU time required by the process
     */
    constructor(id, arrivalTime, burstTime) {
        this.id = id;
        this.arrivalTime = parseInt(arrivalTime);
        this.burstTime = parseInt(burstTime);
        this.remainingTime = parseInt(burstTime);
        this.waitingTime = 0;
        this.turnaroundTime = 0;
        this.completionTime = 0;
        this.startTime = null;
        this.color = this.generateColor();
        this.state = 'ready'; // ready, running, waiting, terminated
    }
    
    /**
     * Generates a unique color for the process based on its ID
     * @returns {string} Hex color code
     */
    generateColor() {
        const colors = [
            '#3498db', '#2ecc71', '#e74c3c', '#f39c12', '#9b59b6', 
            '#1abc9c', '#d35400', '#c0392b', '#16a085', '#8e44ad'
        ];
        // Use process ID to deterministically select a color
        const idNum = this.id.replace('P', '');
        return colors[parseInt(idNum) % colors.length];
    }
}