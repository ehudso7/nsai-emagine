#!/bin/bash
# NSAI Emagine Deployment Script

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Print header
echo -e "${GREEN}=========================================${NC}"
echo -e "${GREEN}      NSAI Emagine Deployment Script     ${NC}"
echo -e "${GREEN}=========================================${NC}\n"

# Check for .env file
if [ ! -f .env ]; then
  echo -e "${YELLOW}Warning: .env file not found. Creating from example...${NC}\n"
  
  if [ -f .env.example ]; then
    cp .env.example .env
    echo -e "${GREEN}Created .env file from .env.example${NC}"
    echo -e "${YELLOW}Please edit .env file with your actual credentials before continuing.${NC}\n"
  else
    echo -e "${RED}Error: .env.example not found. Please create a .env file manually.${NC}\n"
    exit 1
  fi
  
  read -p "Press Enter to continue after editing .env file, or Ctrl+C to exit..."
fi

# Install dependencies
echo -e "\n${GREEN}Installing dependencies...${NC}"
npm install

# Build the application
echo -e "\n${GREEN}Building application...${NC}"
npm run build

# Run tests if they exist
if grep -q "\"test\":" package.json; then
  echo -e "\n${GREEN}Running tests...${NC}"
  npm test
else
  echo -e "\n${YELLOW}No tests specified in package.json. Skipping test phase.${NC}"
fi

# Deploy options
echo -e "\n${GREEN}Choose deployment option:${NC}"
echo "1. Deploy to Vercel (requires Vercel CLI)"
echo "2. Deploy to Netlify (requires Netlify CLI)"
echo "3. Build locally only (no deployment)"
echo "4. Exit"

read -p "Enter choice [1-4]: " choice

case $choice in
  1)
    echo -e "\n${GREEN}Deploying to Vercel...${NC}"
    if command -v vercel &> /dev/null; then
      vercel --prod
    else
      echo -e "${YELLOW}Vercel CLI not found. Installing...${NC}"
      npm install -g vercel
      vercel --prod
    fi
    ;;
  2)
    echo -e "\n${GREEN}Deploying to Netlify...${NC}"
    if command -v netlify &> /dev/null; then
      netlify deploy --prod
    else
      echo -e "${YELLOW}Netlify CLI not found. Installing...${NC}"
      npm install -g netlify-cli
      netlify deploy --prod
    fi
    ;;
  3)
    echo -e "\n${GREEN}Build completed successfully. No deployment performed.${NC}"
    echo -e "${YELLOW}To start the production server locally, run:${NC}"
    echo -e "npm run start"
    ;;
  4)
    echo -e "\n${YELLOW}Deployment cancelled.${NC}"
    exit 0
    ;;
  *)
    echo -e "\n${RED}Invalid option. Exiting.${NC}"
    exit 1
    ;;
esac

echo -e "\n${GREEN}=========================================${NC}"
echo -e "${GREEN}      Deployment process complete         ${NC}"
echo -e "${GREEN}=========================================${NC}"