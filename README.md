# Round Robin CPU Scheduling Simulator

An interactive web-based simulation tool that visually demonstrates the Round Robin CPU scheduling algorithm used in operating systems.  
This educational application provides a comprehensive visualization of how processes are managed, scheduled, and executed in a time-sharing system environment.

---

## Features

### Core Functionality
- Interactive Process Management – Add and manage processes with custom arrival and burst times  
- Real-time Algorithm Visualization – Watch the Round Robin algorithm execute step by step  
- Animated Process States – Visual representation of processes in Ready, Running, Waiting, and Terminated states  
- Gantt Chart Display – Timeline visualization showing process execution history  
- Ready Queue Monitoring – Track processes waiting for CPU execution  

---

### Performance Metrics
- Average Waiting Time – Calculate and display average time processes spend waiting  
- Average Turnaround Time – Measure total time from process arrival to completion  
- Throughput Analysis – Show number of processes completed per unit time  
- CPU Utilization – Display percentage of time CPU was actively processing  

---

### User Controls
- Play / Pause Simulation – Control the animation speed and execution  
- Step-by-Step Navigation – Move forward and backward through execution steps  
- Timeline Slider – Jump to any specific point in the simulation  
- Customizable Parameters – Adjust time quantum and animation speed  
- Input Validation – Ensure proper process data entry  

---

### Export Capabilities
- Screenshot Export – Capture high-quality PNG images of the simulation  
- Multiple Capture Options – Save full simulation, animation panel, or control panel  
- Execution Trace Export – Download detailed simulation data as text files  
- Data Persistence – Export comprehensive statistics and process information  

---

### User Experience
- Responsive Design – Works on desktop, tablet, and mobile devices  
- Color-Coded Visualization – Intuitive color scheme for different process states  
- Interactive Feedback – Real-time notifications and loading states  
- Sample Processes – Pre-loaded examples for quick demonstration  
- Keyboard Support – Press Enter to quickly add processes  

---

## Technical Implementation

- Frontend: HTML5, CSS3, JavaScript (ES6+)  
- Architecture: Modular, class-based design with separation of concerns  
- Visualization: Dynamic DOM manipulation for real-time animations  
- Export: html2canvas library for screenshot functionality  
- Compatibility: Works in all modern browsers  

---

## Educational Value

This simulator serves as an excellent learning tool for understanding:
- Round Robin scheduling algorithm mechanics  
- Process state transitions and management  
- CPU scheduling performance metrics  
- Operating system concepts in action  
- Algorithm visualization techniques  

The application provides immediate visual feedback on how changing parameters like time quantum affects system performance metrics.

