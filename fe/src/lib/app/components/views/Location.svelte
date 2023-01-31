<script>
	export let location = {lat: 0, lon: 0};
</script>

<div>
	lat: <span>{location.lat}</span>, lon: <span>{location.lon}</span>
</div>

<style>
	span {
		font-weight: bold;
		font-size: 1.5rem;
	}
</style>
