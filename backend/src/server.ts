import app from './app';
import { config } from './config/config';

const port = config.app.port || 5000;

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
