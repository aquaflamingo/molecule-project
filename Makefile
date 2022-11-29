project=web3_app_scaffold

###############################################################
# CLIENT
###############################################################
web.start:
	@cd web; yarn start

###############################################################
# CHAIN
###############################################################
hh.node:
	@cd blockchain && yarn start:node

hh.compile:
	@pushd blockchain; yarn compile; popd

hh.deploy:
	@pushd blockchain; yarn deploy; popd
