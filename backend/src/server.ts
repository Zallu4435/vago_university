import { httpServer } from './app';
import { config } from './config/config';

const port = config.app.port || 5000;

httpServer.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
