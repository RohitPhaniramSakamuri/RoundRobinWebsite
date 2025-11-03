/**
 * Animation Controller for Round Robin Scheduling Visualization
 * @class
 */
class AnimationController {
    /**
     * Creates a new AnimationController instance
     */
    constructor() {
        this.scheduler = new RoundRobinScheduler(3);
        this.currentStep = 0;
        this.isPlaying = false;
        this.animationTimer = null;
        
        console.log("AnimationController initialized");
        this.initializeEventListeners();
        this.renderProcessList();
    }
    
    /**
     * Sets up all event listeners for user interactions
     */
    initializeEventListeners() {
        console.log("Setting up event listeners...");
        
        // Process management
        document.getElementById('add-process').addEventListener('click', () => {
            console.log("Add process button clicked");
            this.addProcess();
        });
        
        document.getElementById('clear-processes').addEventListener('click', () => {
            console.log("Clear processes button clicked");
            this.clearProcesses();
        });
        
        // Simulation controls
        document.getElementById('start-simulation').addEventListener('click', () => {
            console.log("Start simulation button clicked");
            this.startSimulation();
        });
        
        document.getElementById('reset-simulation').addEventListener('click', () => {
            console.log("Reset simulation button clicked");
            this.resetSimulation();
        });
        
        // Animation controls
        document.getElementById('play-pause').addEventListener('click', () => {
            console.log("Play/pause button clicked");
            this.togglePlayPause();
        });
        
        document.getElementById('step-forward').addEventListener('click', () => {
            console.log("Step forward button clicked");
            this.stepForward();
        });
        
        document.getElementById('step-backward').addEventListener('click', () => {
            console.log("Step backward button clicked");
            this.stepBackward();
        });
        
        // Parameter changes
        document.getElementById('time-quantum').addEventListener('change', (e) => {
            console.log("Time quantum changed to:", e.target.value);
            this.scheduler.timeQuantum = parseInt(e.target.value);
        });
        
        document.getElementById('animation-speed').addEventListener('change', (e) => {
            console.log("Animation speed changed to:", e.target.value);
            this.scheduler.animationSpeed = parseInt(e.target.value);
            if (this.isPlaying) {
                this.restartAnimation();
            }
        });
        
        // Timeline slider
        document.getElementById('timeline-slider').addEventListener('input', (e) => {
            console.log("Timeline slider moved to:", e.target.value);
            this.jumpToStep(parseInt(e.target.value));
        });
        
        // Export functionality
        document.getElementById('screenshot').addEventListener('click', () => {
            console.log("Screenshot button clicked");
            this.takeScreenshot();
        });
        
        document.getElementById('export-trace').addEventListener('click', () => {
            console.log("Export trace button clicked");
            this.exportTrace();
        });
        
        // Enter key support for process input
        document.getElementById('process-id').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addProcess();
            }
        });
        
        document.getElementById('arrival-time').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addProcess();
            }
        });
        
        document.getElementById('burst-time').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addProcess();
            }
        });
        
        console.log("Event listeners setup complete");
    }
    
    /**
     * Adds a new process based on form inputs
     */
    addProcess() {
        const idInput = document.getElementById('process-id');
        const arrivalInput = document.getElementById('arrival-time');
        const burstInput = document.getElementById('burst-time');
        
        const id = idInput.value.trim();
        const arrivalTime = arrivalInput.value;
        const burstTime = burstInput.value;
        
        console.log("Adding process:", {id, arrivalTime, burstTime});
        
        // Validation
        if (!id) {
            alert('Please enter a Process ID');
            idInput.focus();
            return;
        }
        
        if (!arrivalTime || arrivalTime < 0) {
            alert('Please enter a valid Arrival Time (≥ 0)');
            arrivalInput.focus();
            return;
        }
        
        if (!burstTime || burstTime < 1) {
            alert('Please enter a valid Burst Time (≥ 1)');
            burstInput.focus();
            return;
        }
        
        // Check if process ID already exists
        if (this.scheduler.processes.some(p => p.id === id)) {
            alert(`Process ID "${id}" already exists. Please use a different ID.`);
            idInput.focus();
            return;
        }
        
        // Create and add the process
        const process = new Process(id, arrivalTime, burstTime);
        this.scheduler.addProcess(process);
        this.renderProcessList();
        
        // Clear input fields and focus on process ID for next entry
        idInput.value = '';
        arrivalInput.value = '0';
        burstInput.value = '5';
        idInput.focus();
        
        console.log("Process added successfully. Total processes:", this.scheduler.processes.length);
    }
    
    /**
     * Clears all processes and resets the simulation
     */
    clearProcesses() {
        this.scheduler.clearProcesses();
        this.renderProcessList();
        this.resetAnimation();
        console.log("All processes cleared");
    }
    
    /**
     * Renders the process list in the control panel
     */
    renderProcessList() {
        const processList = document.getElementById('process-list');
        processList.innerHTML = '';
        
        if (this.scheduler.processes.length === 0) {
            processList.innerHTML = '<div style="text-align: center; color: #7f8c8d; font-style: italic;">No processes added</div>';
            return;
        }
        
        this.scheduler.processes.forEach(process => {
            const processItem = document.createElement('div');
            processItem.className = 'process-item';
            processItem.innerHTML = `
                <span style="font-weight: bold; color: ${process.color}">P${process.id}</span>
                <span>AT: ${process.arrivalTime}, BT: ${process.burstTime}</span>
            `;
            processList.appendChild(processItem);
        });
    }
    
    /**
     * Starts the simulation with current processes
     */
    startSimulation() {
        if (this.scheduler.processes.length === 0) {
            alert('Please add at least one process before starting simulation');
            return;
        }
        
        console.log("Starting simulation with", this.scheduler.processes.length, "processes");
        this.scheduler.startSimulation();
        this.currentStep = 0;
        this.updateTimelineSlider();
        this.renderAnimation();
        this.updateStatistics();
        
        console.log("Simulation completed. History length:", this.scheduler.history.length);
    }
    
    /**
     * Resets the entire simulation
     */
    resetSimulation() {
        this.stopAnimation();
        this.scheduler.clearProcesses();
        this.renderProcessList();
        this.resetAnimation();
        console.log("Simulation reset");
    }
    
    /**
     * Toggles between play and pause states
     */
    togglePlayPause() {
        if (this.isPlaying) {
            this.stopAnimation();
        } else {
            this.startAnimation();
        }
    }
    
    /**
     * Starts the animation playback
     */
    startAnimation() {
        if (this.scheduler.history.length === 0 || this.currentStep >= this.scheduler.history.length - 1) {
            console.log("No animation to play or already at end");
            return;
        }
        
        this.isPlaying = true;
        document.getElementById('play-pause').textContent = 'Pause';
        console.log("Animation started");
        
        this.animationTimer = setInterval(() => {
            if (this.currentStep < this.scheduler.history.length - 1) {
                this.currentStep++;
                this.renderAnimation();
                this.updateTimelineSlider();
            } else {
                this.stopAnimation();
                console.log("Animation completed");
            }
        }, this.scheduler.animationSpeed);
    }
    
    /**
     * Stops the animation playback
     */
    stopAnimation() {
        this.isPlaying = false;
        document.getElementById('play-pause').textContent = 'Play';
        if (this.animationTimer) {
            clearInterval(this.animationTimer);
            this.animationTimer = null;
        }
        console.log("Animation stopped");
    }
    
    /**
     * Restarts animation with current speed settings
     */
    restartAnimation() {
        if (this.isPlaying) {
            this.stopAnimation();
            this.startAnimation();
        }
    }
    
    /**
     * Moves one step forward in the animation
     */
    stepForward() {
        if (this.currentStep < this.scheduler.history.length - 1) {
            this.currentStep++;
            this.renderAnimation();
            this.updateTimelineSlider();
            console.log("Stepped forward to step:", this.currentStep);
        }
    }
    
    /**
     * Moves one step backward in the animation
     */
    stepBackward() {
        if (this.currentStep > 0) {
            this.currentStep--;
            this.renderAnimation();
            this.updateTimelineSlider();
            console.log("Stepped backward to step:", this.currentStep);
        }
    }
    
    /**
     * Jumps to a specific step in the animation
     * @param {number} step - Step index to jump to
     */
    jumpToStep(step) {
        if (step >= 0 && step < this.scheduler.history.length) {
            this.currentStep = step;
            this.renderAnimation();
            console.log("Jumped to step:", step);
        }
    }
    
    /**
     * Updates the timeline slider position and labels
     */
    updateTimelineSlider() {
        const slider = document.getElementById('timeline-slider');
        const currentTime = document.getElementById('current-time');
        const totalTime = document.getElementById('total-time');
        
        if (this.scheduler.history.length > 0) {
            slider.max = this.scheduler.history.length - 1;
            slider.value = this.currentStep;
            currentTime.textContent = `Time: ${this.scheduler.history[this.currentStep].time}`;
            totalTime.textContent = `Total: ${this.scheduler.history[this.scheduler.history.length - 1].time}`;
        } else {
            slider.max = 0;
            slider.value = 0;
            currentTime.textContent = 'Time: 0';
            totalTime.textContent = 'Total: 0';
        }
    }
    
    /**
     * Renders the current animation state
     */
    renderAnimation() {
        const canvas = document.getElementById('animation-canvas');
        canvas.innerHTML = '';
        
        if (this.scheduler.history.length === 0) {
            canvas.innerHTML = `
                <div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #7f8c8d; font-style: italic;">
                    No simulation data. Click "Start Simulation" to begin.
                </div>
            `;
            return;
        }
        
        const currentState = this.scheduler.history[this.currentStep];
        
        // Create visualization elements
        this.renderGanttChart(canvas, currentState);
        this.renderProcessStates(canvas, currentState);
        this.renderReadyQueue(canvas, currentState);
    }
    
    /**
     * Renders the Gantt chart visualization
     * @param {HTMLElement} container - Container element
     * @param {Object} state - Current simulation state
     */
    renderGanttChart(container, state) {
        const ganttChart = document.createElement('div');
        ganttChart.style.height = '120px';
        ganttChart.style.marginBottom = '20px';
        ganttChart.style.position = 'relative';
        ganttChart.style.borderBottom = '2px solid #34495e';
        
        // Add title
        const title = document.createElement('div');
        title.textContent = 'Gantt Chart';
        title.style.fontWeight = 'bold';
        title.style.marginBottom = '5px';
        container.appendChild(title);
        
        // Calculate scale based on total time
        const maxTime = this.scheduler.history[this.scheduler.history.length - 1].time;
        const scale = Math.min(600 / Math.max(maxTime, 1), 30); // pixels per time unit
        
        // Create timeline markers
        for (let i = 0; i <= maxTime; i++) {
            const marker = document.createElement('div');
            marker.style.position = 'absolute';
            marker.style.left = `${i * scale}px`;
            marker.style.bottom = '0';
            marker.style.height = '10px';
            marker.style.width = '1px';
            marker.style.backgroundColor = '#34495e';
            
            const label = document.createElement('div');
            label.textContent = i;
            label.style.position = 'absolute';
            label.style.left = `${i * scale}px`;
            label.style.bottom = '-20px';
            label.style.transform = 'translateX(-50%)';
            label.style.fontSize = '12px';
            
            ganttChart.appendChild(marker);
            ganttChart.appendChild(label);
        }
        
        // Add process blocks to Gantt chart
        this.scheduler.ganttChart.forEach(entry => {
            if (entry.start <= state.time) {
                const block = document.createElement('div');
                block.style.position = 'absolute';
                block.style.left = `${entry.start * scale}px`;
                block.style.top = '20px';
                block.style.width = `${(entry.end - entry.start) * scale}px`;
                block.style.height = '40px';
                block.style.backgroundColor = this.getProcessColor(entry.process);
                block.style.border = '2px solid #000';
                block.style.display = 'flex';
                block.style.alignItems = 'center';
                block.style.justifyContent = 'center';
                block.style.color = 'white';
                block.style.fontWeight = 'bold';
                block.textContent = `P${entry.process}`;
                
                ganttChart.appendChild(block);
            }
        });
        
        // Add current time indicator
        const currentTimeIndicator = document.createElement('div');
        currentTimeIndicator.style.position = 'absolute';
        currentTimeIndicator.style.left = `${state.time * scale}px`;
        currentTimeIndicator.style.top = '0';
        currentTimeIndicator.style.bottom = '0';
        currentTimeIndicator.style.width = '2px';
        currentTimeIndicator.style.backgroundColor = '#e74c3c';
        currentTimeIndicator.style.zIndex = '10';
        ganttChart.appendChild(currentTimeIndicator);
        
        container.appendChild(ganttChart);
    }
    
    /**
     * Renders the process states visualization
     * @param {HTMLElement} container - Container element
     * @param {Object} state - Current simulation state
     */
    renderProcessStates(container, state) {
        const processStates = document.createElement('div');
        processStates.style.display = 'flex';
        processStates.style.flexWrap = 'wrap';
        processStates.style.gap = '10px';
        processStates.style.marginBottom = '20px';
        
        // Add title
        const title = document.createElement('div');
        title.textContent = 'Process States';
        title.style.fontWeight = 'bold';
        title.style.width = '100%';
        title.style.marginBottom = '5px';
        container.appendChild(title);
        
        this.scheduler.processes.forEach(process => {
            const processState = state.processes.find(p => p.id === process.id);
            if (!processState) return;
            
            const processContainer = document.createElement('div');
            processContainer.className = 'process-state-container';
            
            const processElement = document.createElement('div');
            processElement.style.padding = '10px';
            processElement.style.borderRadius = '5px';
            processElement.style.textAlign = 'center';
            processElement.style.minWidth = '80px';
            processElement.style.color = 'white';
            processElement.style.fontWeight = 'bold';
            processElement.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
            
            // Set background color based on state
            switch(processState.state) {
                case 'ready':
                    processElement.style.backgroundColor = '#3498db';
                    break;
                case 'running':
                    processElement.style.backgroundColor = '#2ecc71';
                    break;
                case 'terminated':
                    processElement.style.backgroundColor = '#e74c3c';
                    break;
                case 'waiting':
                    processElement.style.backgroundColor = '#f39c12';
                    break;
            }
            
            processElement.innerHTML = `
                <div>P${process.id}</div>
                <div style="font-size: 12px; margin-top: 5px;">
                    Remaining: ${processState.remainingTime}
                </div>
            `;
            
            processContainer.appendChild(processElement);
            
            // Add active indicator if this process is currently running
            if (state.currentProcess === process.id) {
                const activeIndicator = document.createElement('div');
                activeIndicator.className = 'active-indicator';
                activeIndicator.textContent = '↑';
                activeIndicator.style.color = '#e74c3c';
                processContainer.appendChild(activeIndicator);
            }
            
            processStates.appendChild(processContainer);
        });
        
        container.appendChild(processStates);
    }
    
    /**
     * Renders the ready queue visualization
     * @param {HTMLElement} container - Container element
     * @param {Object} state - Current simulation state
     */
    renderReadyQueue(container, state) {
        const readyQueue = document.createElement('div');
        
        // Add title
        const title = document.createElement('div');
        title.textContent = 'Ready Queue';
        title.style.fontWeight = 'bold';
        title.style.marginBottom = '5px';
        readyQueue.appendChild(title);
        
        const queueContainer = document.createElement('div');
        queueContainer.style.display = 'flex';
        queueContainer.style.gap = '5px';
        queueContainer.style.flexWrap = 'wrap';
        queueContainer.style.minHeight = '40px';
        queueContainer.style.padding = '10px';
        queueContainer.style.backgroundColor = '#ecf0f1';
        queueContainer.style.borderRadius = '5px';
        queueContainer.style.alignItems = 'center';
        
        if (state.readyQueue.length > 0) {
            state.readyQueue.forEach(processId => {
                const processElement = document.createElement('div');
                processElement.style.padding = '8px 12px';
                processElement.style.backgroundColor = '#3498db';
                processElement.style.borderRadius = '5px';
                processElement.style.color = 'white';
                processElement.style.fontWeight = 'bold';
                processElement.style.boxShadow = '0 1px 3px rgba(0,0,0,0.2)';
                processElement.textContent = `P${processId}`;
                queueContainer.appendChild(processElement);
            });
        } else {
            const emptyMessage = document.createElement('div');
            emptyMessage.textContent = 'Ready queue is empty';
            emptyMessage.style.color = '#7f8c8d';
            emptyMessage.style.fontStyle = 'italic';
            queueContainer.appendChild(emptyMessage);
        }
        
        readyQueue.appendChild(queueContainer);
        container.appendChild(readyQueue);
    }
    
    /**
     * Gets the color for a specific process
     * @param {string} processId - Process identifier
     * @returns {string} Hex color code
     */
    getProcessColor(processId) {
        const process = this.scheduler.processes.find(p => p.id === processId);
        return process ? process.color : '#95a5a6';
    }
    
    /**
     * Updates the statistics panel with current simulation data
     */
    updateStatistics() {
        const stats = this.scheduler.getStatistics();
        if (!stats) {
            // Reset statistics if no data
            document.getElementById('avg-waiting-time').textContent = '0';
            document.getElementById('avg-turnaround-time').textContent = '0';
            document.getElementById('throughput').textContent = '0';
            document.getElementById('cpu-utilization').textContent = '0%';
            return;
        }
        
        document.getElementById('avg-waiting-time').textContent = stats.avgWaitingTime;
        document.getElementById('avg-turnaround-time').textContent = stats.avgTurnaroundTime;
        document.getElementById('throughput').textContent = stats.throughput;
        document.getElementById('cpu-utilization').textContent = `${stats.cpuUtilization}%`;
    }
    
    /**
     * Resets the animation to initial state
     */
    resetAnimation() {
        this.stopAnimation();
        this.currentStep = 0;
        this.renderAnimation();
        this.updateTimelineSlider();
        this.updateStatistics();
    }
    
        /**
     * Takes a screenshot of the simulation and allows download
     */
    takeScreenshot() {
        console.log("Taking screenshot...");
        
        // Show loading state
        const screenshotBtn = document.getElementById('screenshot');
        const originalText = screenshotBtn.textContent;
        screenshotBtn.textContent = 'Capturing...';
        screenshotBtn.disabled = true;
        
        try {
            // Define the area to capture (main content area)
            const element = document.querySelector('.main-content');
            
            // Configuration for html2canvas
            const options = {
                backgroundColor: '#f5f7fa',
                scale: 2, // Higher quality
                useCORS: true,
                allowTaint: true,
                logging: false,
                width: element.scrollWidth,
                height: element.scrollHeight,
                windowWidth: element.scrollWidth,
                windowHeight: element.scrollHeight
            };
            
            // Capture the screenshot
            html2canvas(element, options).then(canvas => {
                // Convert canvas to data URL
                const imageData = canvas.toDataURL('image/png', 1.0);
                
                // Create download link
                const link = document.createElement('a');
                const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
                link.download = `round-robin-simulation-${timestamp}.png`;
                link.href = imageData;
                
                // Trigger download
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                // Show success message
                this.showNotification('Screenshot saved successfully!', 'success');
                
            }).catch(error => {
                console.error('Screenshot capture failed:', error);
                this.showNotification('Failed to capture screenshot. Please try again.', 'error');
            });
            
        } catch (error) {
            console.error('Screenshot error:', error);
            this.showNotification('Error capturing screenshot: ' + error.message, 'error');
        } finally {
            // Restore button state
            setTimeout(() => {
                screenshotBtn.textContent = originalText;
                screenshotBtn.disabled = false;
            }, 1000);
        }
    }
    
    /**
     * Shows a notification message to the user
     * @param {string} message - The message to display
     * @param {string} type - The type of notification (success, error, info)
     */
    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotification = document.querySelector('.screenshot-notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `screenshot-notification screenshot-${type}`;
        notification.textContent = message;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            border-radius: 5px;
            color: white;
            font-weight: bold;
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            transition: all 0.3s ease;
            max-width: 300px;
            word-wrap: break-word;
        `;
        
        // Set background color based on type
        if (type === 'success') {
            notification.style.backgroundColor = '#27ae60';
        } else if (type === 'error') {
            notification.style.backgroundColor = '#e74c3c';
        } else {
            notification.style.backgroundColor = '#3498db';
        }
        
        // Add to page
        document.body.appendChild(notification);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.opacity = '0';
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.remove();
                    }
                }, 300);
            }
        }, 3000);
    }
    
    /**
     * Exports the execution trace as a text file
     */
    exportTrace() {
        if (this.scheduler.history.length === 0) {
            alert('No simulation data to export. Please run a simulation first.');
            return;
        }
        
        let traceData = "Round Robin Scheduling Execution Trace\n";
        traceData += "=========================================\n";
        traceData += `Time Quantum: ${this.scheduler.timeQuantum}\n`;
        traceData += `Total Processes: ${this.scheduler.processes.length}\n`;
        traceData += `Total Simulation Time: ${this.scheduler.history[this.scheduler.history.length - 1].time}\n\n`;
        
        traceData += "Time\tCurrent Process\tReady Queue\tCompleted Processes\n";
        traceData += "----\t---------------\t-----------\t-------------------\n";
        
        this.scheduler.history.forEach(state => {
            traceData += `${state.time}\t${state.currentProcess || "IDLE"}\t\t${state.readyQueue.join(' ') || "-"}\t\t${state.completedProcesses.join(' ') || "-"}\n`;
        });
        
        // Add statistics
        const stats = this.scheduler.getStatistics();
        if (stats) {
            traceData += `\nStatistics:\n`;
            traceData += `- Average Waiting Time: ${stats.avgWaitingTime}\n`;
            traceData += `- Average Turnaround Time: ${stats.avgTurnaroundTime}\n`;
            traceData += `- Throughput: ${stats.throughput}\n`;
            traceData += `- CPU Utilization: ${stats.cpuUtilization}%\n`;
        }
        
        // Create and trigger download
        const blob = new Blob([traceData], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `round_robin_trace_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        console.log("Execution trace exported");
    }
}