#!/usr/bin/env bash

WP_TOTAL=();

if [[ $1 == 'block-theme' ]]; then
		echo "Block Theme:"
		npm run env:cli -- theme activate twentytwentythree --quiet --path=/var/www/build
	else
		echo "Classic Theme:"
		npm run env:cli -- theme activate twentytwentyone --quiet --path=/var/www/build
fi

TEST_RUNS=${TEST_RUNS:-30}

for ((i=1; i<=TEST_RUNS; i++ ))
do
	# Clear caches.
	curl -s http://wordpress-develop?reset_helper

	# Warm caches.
	curl -s -o /dev/null http://wordpress-develop

	# Actual request for measuring.
	SERVER_TIMING=$(curl -sI -X GET http://wordpress-develop | tr -d '\r' | sed -En 's/^Server-Timing: (.*)/\1/p')

	IFS=', ' read -r -a ENTRIES <<< "$SERVER_TIMING"

	for ENTRY in "${ENTRIES[@]}"
  do
  	IFS=';' read -r -a ENTRY_PARTS <<< "$ENTRY"

  		KEY=${ENTRY_PARTS[0]}
  		VALUE=${ENTRY_PARTS[1]}
  		VALUE=${VALUE/dur=/}

  		if [ "$KEY" == "wp-total" ]; then
  			WP_TOTAL+=( "$VALUE" )
  		fi

#    	echo "Key: $KEY"
#    	echo "Value: $VALUE"
  done
done

IFS=$'\n'
MEDIAN=$(awk '{arr[NR]=$1} END {if (NR%2==1) print arr[(NR+1)/2]; else print (arr[NR/2]+arr[NR/2+1])/2}' <<< sort <<< "${WP_TOTAL[*]}")
unset IFS

STDDEV=$(awk 'NF {sum=0;ssq=0;for (i=1;i<=NF;i++){sum+=$i;ssq+=$i**2}; print (ssq/NF-(sum/NF)**2)**0.5}' <<< "${WP_TOTAL[*]}")

echo "Iterations: ${#WP_TOTAL[@]} / Median: $MEDIAN / Std deviation: $STDDEV"
