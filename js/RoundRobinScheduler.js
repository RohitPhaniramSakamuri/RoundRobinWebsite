/**
 * Round Robin CPU Scheduling Simulator
 * @class
 */
class RoundRobinScheduler {
    /**
     * Creates a new RoundRobinScheduler instance
     * @param {number} timeQuantum - Time slice for each process execution
     */
    constructor(timeQuantum) {
        this.timeQuantum = timeQuantum;
        this.processes = [];
        this.readyQueue = [];
        this.completedProcesses = [];
        this.currentTime = 0;
        this.currentProcess = null;
        this.isRunning = false;
        this.animationInterval = null;
        this.animationSpeed = 1000;
        this.history = [];
        this.ganttChart = [];
    }
    
    /**
     * Adds a process to the scheduler
     * @param {Process} process - Process to add
     */
    addProcess(process) {
        this.processes.push(process);
        // Sort processes by arrival time for proper simulation
        this.processes.sort((a, b) => a.arrivalTime - b.arrivalTime);
    }
    
    /**
     * Removes all processes and resets the scheduler
     */
    clearProcesses() {
        this.processes = [];
        this.readyQueue = [];
        this.completedProcesses = [];
        this.currentTime = 0;
        this.currentProcess = null;
        this.history = [];
        this.ganttChart = [];
    }
    
    /**
     * Starts the simulation with current processes
     */
    startSimulation() {
        if (this.processes.length === 0) {
            console.warn("No processes to simulate");
            return;
        }
        
        this.isRunning = true;
        this.readyQueue = [];
        this.completedProcesses = [];
        this.currentTime = 0;
        this.currentProcess = null;
        this.history = [];
        this.ganttChart = [];
        
        // Reset all process states
        this.processes.forEach(p => {
            p.remainingTime = p.burstTime;
            p.waitingTime = 0;
            p.turnaroundTime = 0;
            p.completionTime = 0;
            p.startTime = null;
            p.state = 'ready';
        });
        
        this.simulate();
    }
    
    /**
     * Executes the Round Robin scheduling algorithm
     */
    simulate() {
        let processesCopy = [...this.processes];
        let time = 0;
        let lastProcessTime = {};
        
        // Continue until all processes are completed
        while (processesCopy.length > 0 || this.readyQueue.length > 0) {
            // Add newly arrived processes to ready queue
            let arrivedProcesses = processesCopy.filter(p => p.arrivalTime <= time);
            arrivedProcesses.forEach(p => {
                if (!this.readyQueue.includes(p) && !this.completedProcesses.includes(p)) {
                    this.readyQueue.push(p);
                    p.state = 'ready';
                }
            });
            processesCopy = processesCopy.filter(p => !arrivedProcesses.includes(p));
            
            if (this.readyQueue.length > 0) {
                // Get the next process from the ready queue (FIFO)
                let process = this.readyQueue.shift();
                
                // Record start time if this is the first time the process is running
                if (process.startTime === null) {
                    process.startTime = time;
                }
                
                // Calculate waiting time since last execution or arrival
                if (lastProcessTime[process.id] !== undefined) {
                    process.waitingTime += time - lastProcessTime[process.id];
                } else {
                    process.waitingTime += time - process.arrivalTime;
                }
                
                // Execute the process for time quantum or until completion
                let executionTime = Math.min(this.timeQuantum, process.remainingTime);
                
                // Update process state and record in history
                process.state = 'running';
                this.currentProcess = process;
                this.recordState(time);
                
                // Add to Gantt chart for visualization
                this.ganttChart.push({
                    process: process.id,
                    start: time,
                    end: time + executionTime,
                    state: 'running'
                });
                
                // Advance time and reduce remaining time
                time += executionTime;
                process.remainingTime -= executionTime;
                
                // Update last process time for waiting time calculation
                lastProcessTime[process.id] = time;
                
                // Check if process is completed
                if (process.remainingTime === 0) {
                    process.completionTime = time;
                    process.turnaroundTime = process.completionTime - process.arrivalTime;
                    process.state = 'terminated';
                    this.completedProcesses.push(process);
                } else {
                    process.state = 'waiting';
                    // Add back to ready queue if not completed
                    this.readyQueue.push(process);
                }
                
                this.currentProcess = null;
                // Record state after execution
                this.recordState(time);
            } else {
                // CPU is idle - no processes in ready queue
                time++;
                this.recordState(time);
            }
        }
        
        this.currentTime = time;
        this.isRunning = false;
    }
    
    /**
     * Records the current state of the simulation for animation
     * @param {number} time - Current simulation time
     */
    recordState(time) {
        const state = {
            time: time,
            currentProcess: this.currentProcess ? this.currentProcess.id : null,
            readyQueue: [...this.readyQueue].map(p => p.id),
            completedProcesses: [...this.completedProcesses].map(p => p.id),
            processes: this.processes.map(p => ({
                id: p.id,
                state: p.state,
                remainingTime: p.remainingTime,
                waitingTime: p.waitingTime,
                turnaroundTime: p.turnaroundTime
            }))
        };
        this.history.push(state);
    }
    
    /**
     * Calculates and returns simulation statistics
     * @returns {Object} Statistics object or null if no processes completed
     */
    getStatistics() {
        if (this.completedProcesses.length === 0) return null;
        
        const totalWaitingTime = this.completedProcesses.reduce((sum, p) => sum + p.waitingTime, 0);
        const totalTurnaroundTime = this.completedProcesses.reduce((sum, p) => sum + p.turnaroundTime, 0);
        const avgWaitingTime = (totalWaitingTime / this.completedProcesses.length).toFixed(2);
        const avgTurnaroundTime = (totalTurnaroundTime / this.completedProcesses.length).toFixed(2);
        const throughput = (this.completedProcesses.length / this.currentTime).toFixed(3);
        
        // Calculate CPU utilization (time when CPU was not idle)
        let busyTime = 0;
        this.ganttChart.forEach(entry => {
            if (entry.state === 'running') {
                busyTime += (entry.end - entry.start);
            }
        });
        const cpuUtilization = ((busyTime / this.currentTime) * 100).toFixed(1);
        
        return {
            avgWaitingTime,
            avgTurnaroundTime,
            throughput,
            cpuUtilization
        };
    }
}