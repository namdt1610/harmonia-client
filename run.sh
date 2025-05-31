#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Project directories
CLIENT_DIR="./harmonia-client"
ADMIN_DIR="./harmonia-admin"
SERVER_DIR="./harmonia-server"

# Function to check if a directory exists
check_directory() {
    if [ ! -d "$1" ]; then
        echo -e "${RED}Error: Directory $1 does not exist${NC}"
        return 1
    fi
    return 0
}

# Function to start a project
start_project() {
    local project=$1
    local dir=$2
    local port=$3

    echo -e "${BLUE}Starting $project...${NC}"
    cd "$dir" || return 1
    
    # Check if node_modules exists
    if [ ! -d "node_modules" ]; then
        echo -e "${YELLOW}Installing dependencies for $project...${NC}"
        npm install
    fi

    # Start the project
    if [ "$project" = "server" ]; then
        npm run dev &
    else
        PORT=$port npm run dev &
    fi
    
    cd - > /dev/null
    echo -e "${GREEN}$project started successfully!${NC}"
}

# Function to stop all projects
stop_projects() {
    echo -e "${YELLOW}Stopping all projects...${NC}"
    pkill -f "node.*next"
    pkill -f "node.*server"
    echo -e "${GREEN}All projects stopped${NC}"
}

# Function to show status
show_status() {
    echo -e "${BLUE}Project Status:${NC}"
    
    # Check client
    if pgrep -f "node.*harmonia-client" > /dev/null; then
        echo -e "${GREEN}Client: Running${NC}"
    else
        echo -e "${RED}Client: Stopped${NC}"
    fi
    
    # Check admin
    if pgrep -f "node.*harmonia-admin" > /dev/null; then
        echo -e "${GREEN}Admin: Running${NC}"
    else
        echo -e "${RED}Admin: Stopped${NC}"
    fi
    
    # Check server
    if pgrep -f "node.*harmonia-server" > /dev/null; then
        echo -e "${GREEN}Server: Running${NC}"
    else
        echo -e "${RED}Server: Stopped${NC}"
    fi
}

# Main menu
show_menu() {
    echo -e "\n${BLUE}Harmonia Project Manager${NC}"
    echo "1. Start all projects"
    echo "2. Stop all projects"
    echo "3. Start client (port 3000)"
    echo "4. Start admin (port 3001)"
    echo "5. Start server (port 3002)"
    echo "6. Show status"
    echo "7. Exit"
    echo -n "Select an option: "
}

# Main loop
while true; do
    show_menu
    read -r choice

    case $choice in
        1)
            # Start all projects
            check_directory "$CLIENT_DIR" && start_project "client" "$CLIENT_DIR" 3000
            check_directory "$ADMIN_DIR" && start_project "admin" "$ADMIN_DIR" 3001
            check_directory "$SERVER_DIR" && start_project "server" "$SERVER_DIR" 3002
            ;;
        2)
            stop_projects
            ;;
        3)
            check_directory "$CLIENT_DIR" && start_project "client" "$CLIENT_DIR" 3000
            ;;
        4)
            check_directory "$ADMIN_DIR" && start_project "admin" "$ADMIN_DIR" 3001
            ;;
        5)
            check_directory "$SERVER_DIR" && start_project "server" "$SERVER_DIR" 3002
            ;;
        6)
            show_status
            ;;
        7)
            echo -e "${GREEN}Goodbye!${NC}"
            exit 0
            ;;
        *)
            echo -e "${RED}Invalid option${NC}"
            ;;
    esac
done 