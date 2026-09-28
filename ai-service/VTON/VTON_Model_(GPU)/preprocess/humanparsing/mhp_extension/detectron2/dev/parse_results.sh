

LOG="$1"

if [[ -z "$LOG" ]]; then
	echo "Usage: $0 /path/to/log/file"
	exit 1
fi


trainspeed=$(grep -o 'Overall training.*' "$LOG" | grep -Eo '\(.*\)' | grep -o '[0-9\.]*')
echo "Training speed: $trainspeed s/it"

inferencespeed=$(grep -o 'Total inference pure.*' "$LOG" | tail -n1 | grep -Eo '\(.*\)' | grep -o '[0-9\.]*' | head -n1)
echo "Inference speed: $inferencespeed s/it"

memory=$(grep -o 'max[_ ]mem: [0-9]*' "$LOG" | tail -n1 | grep -o '[0-9]*')
echo "Training memory: $memory MB"

echo "Easy to copypaste:"
echo "$trainspeed","$inferencespeed","$memory"

echo "------------------------------"


echo "COCO Results:"
num_tasks=$(grep -o 'copypaste:.*Task.*' "$LOG" | sort -u | wc -l)
grep -o 'copypaste:.*' "$LOG" | cut -d ' ' -f 2- | tail -n $((num_tasks * 3))
