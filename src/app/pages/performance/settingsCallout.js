import { Heading } from '../../components';
import {
	Card,
	CardBody,
	CardHeader,
    CardFooter,
    Button
} from '@wordpress/components';
import { settings } from '@wordpress/icons';

const SettingsCallout = () => {

	return (
		<Card className="short card-settings-callout">
			<CardHeader>
				<Heading level="3">
					{__('Settings', 'wp-plugin-hostgator')}
				</Heading>
			</CardHeader>
			<CardBody>
				{__(
					'Manage your site settings. You can ajdust automatic updates, comments, revisions and more.',
					'wp-plugin-hostgator'
				)}
			</CardBody>
            <CardFooter>
                <Button
                    variant="primary"
                    href="#/settings"
                    icon={settings}
					className="callout-link-settings"
                >
                    {__('Settings', 'wp-plugin-hostgator')}
                </Button>
            </CardFooter>
		</Card>
	);
};

export default SettingsCallout;
