import ActionField from "../../components/action-field";
import { SectionSettings } from "../../components/section";

const SettingsSection = () => {
	return (
		<SectionSettings
			title={__('Settings and Performance', 'wp-plugin-hostgator')}
			description={__('Customize & fine-tune your site.', 'wp-plugin-hostgator')}
		>
			<div className="nfd-flex nfd-flex-col nfd-gap-5">
				<ActionField
					label={__("Manage Settings", "wp-plugin-hostgator")}
					buttonLabel={__("Settings", "wp-plugin-hostgator")}
					href={"#/settings"}
					className={"hgwp-app-home-settings-action"}
				>
					{__('Manage your site settings. You can ajdust automatic updates, comments, revisions and more.', 'wp-plugin-hostgator')}
				</ActionField>

				<ActionField
					label={__("Performance", "wp-plugin-hostgator")}
					buttonLabel={__("Performance", "wp-plugin-hostgator")}
					href={"#/performance"}
					className={"hgwp-app-home-performance-action"}
				>
					{__('Manage site performance and caching settings as well as clear the site cache.', 'wp-plugin-hostgator')}
				</ActionField>

				<ActionField
					label={__("Marketplace", "wp-plugin-hostgator")}
					buttonLabel={__("Visit Marketplace", "wp-plugin-hostgator")}
					href={"#/marketplace"}
					className={"hgwp-app-home-marketplace-action"}
				>
					{__('Add site services, themes or plugins from the marketplace.', 'wp-plugin-hostgator')}
				</ActionField>
			</div>
		</SectionSettings >
	);
};

export default SettingsSection;
