import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Link from '@mui/material/Link';
import Step from '@mui/material/Step';
import StepContent from '@mui/material/StepContent';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import Typography from '@mui/material/Typography';
import './index.scss';

export default function LoginHelpDialog({ open, onClose }) {
  return (
    <Dialog maxWidth="sm" open={open} onClose={onClose} data-testid="login-help-dialog">
      <DialogTitle>Setting up and Login to RClone</DialogTitle>
      <DialogContent>
        <Stepper orientation="vertical">
          <Step expanded active>
            <StepLabel>Install and Setup RClone</StepLabel>
            <StepContent>
              <Typography>
                Go to <Link href="https://rclone.org/docs">https://rclone.org/docs</Link>{' '}
                to install and connect your cloud drive to your RClone configuration
                locally
              </Typography>
            </StepContent>
          </Step>
          <Step expanded active>
            <StepLabel>Run RClone in RCD Mode</StepLabel>
            <StepContent>
              <Typography>
                Run these commands to run RClone in remote-control mode:
              </Typography>
              <Typography className="login-help-dialog__code-block">
                <code>
                  rclone rcd \ <br />
                  --rc-allow-origin '*' \ <br />
                  --rc-user='admin' \ <br />
                  --rc-pass="1234" \ <br />
                  --rc-serve \ <br />
                  --config Your_RClone_Config_File <br />
                </code>
              </Typography>
              <Typography>
                where <code>Your_RClone_Config_File</code> is the location of your RClone
                config file.
              </Typography>
              <Typography>
                More info is at{' '}
                <Link href="https://rclone.org/rc">https://rclone.org/rc/</Link>
              </Typography>
            </StepContent>
          </Step>
          <Step expanded active>
            <StepLabel>Enter your RClone Endpoints</StepLabel>
            <StepContent>
              <Typography>
                From step (2), your RClone instance configuration is:
                <ol>
                  <li>
                    Endpoint: <code>http://localhost:5572</code>
                  </li>
                  <li>
                    Username: <code>admin</code>
                  </li>
                  <li>
                    Password: <code>1234</code>
                  </li>
                </ol>
                Enter those in the login form
              </Typography>
            </StepContent>
          </Step>
        </Stepper>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} data-testid="close-button">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
