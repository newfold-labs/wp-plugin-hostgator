import { FreePlugins } from "@newfold-labs/wp-module-ecommerce";
import { useNotification } from "../../components/notifications/feed";

const FreePluginsSection = () => {

    const notify = useNotification();
    return <FreePlugins notify={notify} showShadowBox={false} />
}

export default FreePluginsSection;
