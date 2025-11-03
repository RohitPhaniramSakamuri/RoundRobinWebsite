/**
 * Main application entry point
 * Initializes the AnimationController when DOM is loaded
 */

// Global variable for debugging
let animationController;

document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM fully loaded and parsed");
    
    try {
        // Initialize the animation controller
        animationController = new AnimationController();
        console.log("AnimationController initialized successfully");
        
        // Add some sample processes for demonstration
        addSampleProcesses();
        
    } catch (error) {
        console.error("Error initializing AnimationController:", error);
        alert("Error initializing application. Please check console for details.");
    }
});

/**
 * Adds sample processes for demonstration purposes
 */
function addSampleProcesses() {
    console.log("Adding sample processes...");
    
    // Only add samples if no processes exist
    if (animationController && animationController.scheduler.processes.length === 0) {
        const sampleProcesses = [
            { id: '1', arrivalTime: 0, burstTime: 8 },
            { id: '2', arrivalTime: 1, burstTime: 4 },
            { id: '3', arrivalTime: 2, burstTime: 9 },
            { id: '4', arrivalTime: 3, burstTime: 5 }
        ];
        
        sampleProcesses.forEach(process => {
            const p = new Process(process.id, process.arrivalTime, process.burstTime);
            animationController.scheduler.addProcess(p);
        });
        
        animationController.renderProcessList();
        console.log("Sample processes added");
    }
}